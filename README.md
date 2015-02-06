AIS-Downloader
==========================

A tool for querying the AIS Store database.

## Requirements

On the client side we use:

* JavaScript/HTML
* AngularJS (for forms and calling webservices)
* Twitter Bootstrap (for basic layout)
* JQuery (limited use for some DOM-manipulation)
* HTML5 Application Cache
* OpenLayers

On the server side we use:

* Java 8
* Maven (for building)
* SpringBoot (for packaging single jar service and REST)


## Building ##

    mvn clean install

## Launch

The build produces a executable .war-file in the /target folder. The application can be launched with:

    java -jar target/ais-downloader-0.1-SNAPSHOT.war

or by using maven:

    mvn spring-boot:run

A local deployment will setup AIS-Downloader at the following URL:

    http://localhost:8080/downloader/query.html

