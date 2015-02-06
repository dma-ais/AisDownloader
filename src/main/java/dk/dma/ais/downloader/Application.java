package dk.dma.ais.downloader;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.logging.Logger;


@Configuration
@EnableAutoConfiguration
@ComponentScan
@EnableScheduling
public class Application {

    private final static Logger log = Logger.getLogger(Application.class.getName());
    public static String AIS_VIEW_URL = "https://ais2.e-navigation.net/aisview/rest/store/query?";

    public static void main(String[] args) {

        // If you are running AisView on your local machine,
        // pass "http://localhost:8090/store/query?" as the first argument
        if (args.length > 0 && args[0].startsWith("http")) {
            AIS_VIEW_URL = args[0];
            log.warning("******** AIS_VIEW_URL: " + AIS_VIEW_URL);
        }

        SpringApplication.run(Application.class, args);
    }

}