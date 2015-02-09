/* Copyright (c) 2011 Danish Maritime Authority
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this library.  If not, see <http://www.gnu.org/licenses/>.
 */
package dk.dma.ais.downloader;

import dk.dma.ais.packet.AisPacketFilters;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.net.URL;
import java.net.URLConnection;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.file.DirectoryStream;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A repository service.<br>
 * Streams files from the repository.
 * <p>
 *     The repository is public in as much as everybody can download all files.<br>
 * </p>
 */
@Controller
@RequestMapping("/downloader/query")
@SuppressWarnings("unused")
public class QueryService {

    /**
     * Defined a worker pool size of 2 to constrain load
     */
    private static final int EXECUTOR_POOL_SIZE = 10;
    private static final long FILE_EXPIRY_MS = 1000L * 60L * 60L * 4L; // 4 hours
    private final static Logger log = Logger.getLogger(QueryService.class.getName());
    private final static String DOWNLOAD_SUFFIX = ".download";

    private Path repoRoot;
    private ExecutorService processPool;

    /**
     * Initializes the repository
     */
    @PostConstruct
    public void init() throws Exception {
        // Create the repo root directory
        repoRoot = Paths.get(System.getProperty("user.home")).resolve(".aisdownloader");
        if (!Files.exists(getRepoRoot())) {
            try {
                Files.createDirectories(getRepoRoot());
            } catch (IOException e) {
                log.log(Level.SEVERE, "Error creating repository dir " + getRepoRoot(), e);
            }
        }

        // Initialize process pool
        processPool = Executors.newFixedThreadPool(EXECUTOR_POOL_SIZE);

        log.info("Initialized the QueryService");
    }

    @PreDestroy
    public void cleanUp() throws Exception {
        if (processPool != null && !processPool.isShutdown()) {
            processPool.shutdown();
            processPool = null;
        }
        log.info("Destroyed the QueryService");
    }

    /**
     * Returns the repository root
     * @return the repository root
     */
    public Path getRepoRoot() {
        return repoRoot;
    }

    /**
     * Creates a URI from the repo file
     * @param repoFile the repo file
     * @return the URI for the file
     */
    public String getRepoUri(Path repoFile) {
        Path filePath = getRepoRoot().relativize(repoFile);
        return "/rest/repo/file/" + filePath;
    }

    /**
     * Creates a path from the repo file relative to the repo root
     * @param repoFile the repo file
     * @return the path for the file
     */
    public String getRepoPath(Path repoFile) {
        Path filePath = getRepoRoot().relativize(repoFile);
        return filePath.toString().replace('\\', '/');
    }


    /**
     * Asynchronously loads the given file
     * @param url the URL to load
     * @param path the path to save the file to
     */
    private void asyncLoadFile(final String url, final Path path) {
        Runnable job = () -> {
            long t0 = System.currentTimeMillis();

            // For the resulting file, drop the ".download" suffix
            String name = path.getFileName().toString();
            name = name.substring(0, name.length() - DOWNLOAD_SUFFIX.length());

            try {

                // Set up a few timeouts and fetch the attachment
                URLConnection con = new URL(url).openConnection();
                con.setConnectTimeout(60 * 1000);       // 1 minute
                con.setReadTimeout(10 * 60 * 1000);     // 10 minutes
                try (ReadableByteChannel rbc = Channels.newChannel(con.getInputStream());
                     FileOutputStream fos = new FileOutputStream(path.toFile())) {
                    fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
                }
                log.info(String.format("Copied %s -> %s in %d ms",
                        url,
                        path,
                        System.currentTimeMillis() - t0));

            } catch (Exception e) {
                log.log(Level.SEVERE, "Failed downloading " + url + ": " + e.getMessage());

                // Delete the old file
                if (Files.exists(path)) {
                    try {
                        Files.delete(path);
                    } catch (IOException e1) {
                        log.finer("Failed deleting old file " + path);
                    }
                }

                // Save an error file
                Path errorFile = path.getParent().resolve(name + ".err.txt");
                try (PrintStream err = new PrintStream(new FileOutputStream(errorFile.toFile()))) {
                    e.printStackTrace(err);
                } catch (IOException ex) {
                    log.finer("Failed generating error file " + errorFile);
                }
                return;
            }

            try {
                Path resultPath = path.getParent().resolve(name);
                Files.move(path, resultPath);
            } catch (IOException e) {
                log.log(Level.SEVERE, "Failed renaming path " + path + ": " + e.getMessage());
            }
        };

        log.info("Submitting new job: " + url);
        processPool.submit(job);
    }


    @RequestMapping( value = "/execute/{clientId}", method= RequestMethod.GET)
    @ResponseBody
    public RepoFile executeQuery(@PathVariable("clientId") String clientId,
                                 @RequestParam("params") String params) throws IOException {
        String url = Application.AIS_VIEW_URL + params;

        // Create the client ID folder
        Path dir = repoRoot.resolve(clientId);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }

        // Create a new file to hold the result
        // (could have used Files.createTempFile, but this should be enough to create a unique file)
        Date now = new Date();
        Path file = Files.createTempFile(
                dir,
                new SimpleDateFormat("MM-dd HHmmss ").format(now),
                fileType(url) + DOWNLOAD_SUFFIX);


        // Load the file async
        asyncLoadFile(url, file);

        // Return a RepoFile for the newly created file
        RepoFile vo = new RepoFile();
        vo.setName(file.getFileName().toString());
        vo.setPath(clientId + "/" + file.getFileName().toString());
        vo.setUpdated(now);
        vo.setSize(0L);
        return vo;
    }

    /**
     * Returns the file type of the given URL
     * @param url the url
     * @return the file type
     */
    private String fileType(String url) {
        if (url.contains("OUTPUT_TO_KML")) {
            return ".kml";
        } else if (url.contains("OUTPUT_TO_HTML")) {
            return ".html";
        } else if (url.contains("table")) {
            return ".csv";
        } else if (url.contains("json")) {
            return ".json";
        }
        return ".txt";
    }

    /**
     * Streams the file specified by the path
     */
    @RequestMapping( value = "/file/{clientId}/{file:.*}", method= RequestMethod.GET)
    public void  streamFile(@PathVariable("clientId") String clientId,
                            @PathVariable("file") String file,
                            HttpServletResponse response) throws IOException {

        Path path = repoRoot
                .resolve(clientId)
                .resolve(file);

        if (Files.notExists(path) || Files.isDirectory(path)) {
            log.log(Level.WARNING, "Failed streaming file: " + path);
            response.setStatus(404);
            return;
        }

        response.setContentType(Files.probeContentType(path));
        try (InputStream in = Files.newInputStream(path)) {
            IOUtils.copy(in, response.getOutputStream());
            response.flushBuffer();
        }
    }

    /**
     * Streams the file specified by the path
     */
    @RequestMapping( value = "/delete/{clientId}/{file:.*}", method= RequestMethod.GET)
    @ResponseBody
    public String  deleteFile(@PathVariable("clientId") String clientId,
                            @PathVariable("file") String file,
                            HttpServletResponse response) throws IOException {

        Path path = repoRoot
                .resolve(clientId)
                .resolve(file);

        if (Files.notExists(path) || Files.isDirectory(path)) {
            log.log(Level.WARNING, "Failed deleting file: " + path);
            response.setStatus(404);
            return "404";
        }

        Files.delete(path);
        log.info("Deleted " + path);
        return "Deleted " + path;
    }

    /**
     * Returns a list of files in the folder specified by the clientId
     * @return the list of files in the folder specified by the path
     */
    @RequestMapping( value = "/list/{clientId:.*}", method= RequestMethod.GET, produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<RepoFile> listFiles(@PathVariable("clientId") String clientId) throws IOException {

        List<RepoFile> result = new ArrayList<>();
        Path folder = repoRoot.resolve(clientId);

        if (Files.exists(folder) && Files.isDirectory(folder)) {

            // Filter out directories, hidden files, thumbnails and map images
            DirectoryStream.Filter<Path> filter = file ->
                    Files.isRegularFile(file) &&
                            !file.getFileName().toString().startsWith(".");

            try (DirectoryStream<Path> stream = Files.newDirectoryStream(folder, filter)) {
                stream.forEach(f -> {
                    RepoFile vo = new RepoFile();
                    vo.setName(f.getFileName().toString());
                    vo.setPath(clientId + "/" + f.getFileName().toString());
                    try {
                        vo.setUpdated(new Date(Files.getLastModifiedTime(f).toMillis()));
                        vo.setSize(Files.size(f));
                    } catch (Exception e) {
                        log.finer("Error reading file attribute for " + f);
                    }
                    vo.setComplete(!f.getFileName().toString().endsWith(DOWNLOAD_SUFFIX));
                    result.add(vo);
                });
            }
        }
        return result;
    }

    /**
     * Validates the AIS filter passed along. The filter must adhere to the
     * grammar defined by the AisLib:
     * https://github.com/dma-ais/AisLib
     * @param filter the filter to validate
     * @return the the filter is valid or not
     */
    @RequestMapping( value = "/validate-filter", method= RequestMethod.GET)
    @ResponseBody
    public boolean validateFilter(@RequestParam("filter") String filter)  {

        try {
            AisPacketFilters.parseExpressionFilter(filter);
            log.fine("Successfully parsed filter: " + filter);
            return true;
        } catch (Exception e) {
            log.fine("Failed parsing filter: " + filter + ": " + e);
            return false;
        }
    }


    /***************************************/
    /** Repo clean-up methods             **/
    /***************************************/

    /**
     * called every hour to clean up the repo
     */
    @Scheduled(cron="12 27 */1 * * *")
    public void cleanUpRepoFolder() {

        long now = System.currentTimeMillis();
        long expiredTime = now - FILE_EXPIRY_MS;

        try {
            Files.walkFileTree(getRepoRoot(), new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    if (!dir.equals(getRepoRoot()) && isDirEmpty(dir)) {
                        log.info("Deleting repo directory :" + dir);
                        Files.delete(dir);
                    }
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    if (Files.getLastModifiedTime(file).toMillis() < expiredTime) {
                        log.info("Deleting repo file      :" + file);
                        Files.delete(file);
                    }
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            log.log(Level.SEVERE, "Failed cleaning up repo: " + e.getMessage());
        }

        log.info(String.format("Cleaned up repo in %d ms", System.currentTimeMillis() - now));
    }

    /**
     * Returns if the directory is empty or not
     * @param directory the directory to check
     * @return if the directory is empty or not
     */
    private static boolean isDirEmpty(final Path directory) throws IOException {
        try(DirectoryStream<Path> dirStream = Files.newDirectoryStream(directory)) {
            return !dirStream.iterator().hasNext();
        } catch (Exception e) {
            // Should never happen
            return false;
        }
    }
}
