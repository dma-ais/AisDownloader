/**
 * The main AIS-Downloader controller
 */
angular.module('aisdownloader.app')

    /**
     * The main AIS Query controller
     */
    .controller('AisQueryCtrl', ['$scope', '$timeout', 'growlNotifications', 'AisQueryService',
        function ($scope, $timeout, growlNotifications, AisQueryService) {
            'use strict';

            // ****************************************
            // ** Bootstrapping
            // ****************************************

            $scope.init = function () {

                // Initialize source filter
                $scope.sourceFilter = VS.init({
                    container: $('#sourceFilter'),
                    query: '',
                    showFacets: true,
                    unquotable: [],
                    callbacks: {
                        search: function (query, searchCollection) {
                            $scope.$apply(function () {
                                $scope.updateSourceFilter(true);
                            });
                        },
                        facetMatches: function (callback) {
                            callback(['type', 'bs', 'country', 'region'], {preserveOrder: true});
                        },
                        valueMatches: function (facet, searchTerm, callback) {
                            switch (facet) {
                                case 'type':
                                    callback(sourceTypes, {preserveOrder: true});
                                    break;
                                case 'country':
                                    callback(countryList, {preserveOrder: true});
                                    break;
                            }
                        }
                    }
                });

                // Initialize target filter
                $scope.targetFilter = VS.init({
                    container: $('#targetFilter'),
                    query: '',
                    showFacets: true,
                    unquotable: [],
                    callbacks: {
                        search: function (query, searchCollection) {
                            $scope.$apply(function () {
                                $scope.updateTargetFilter(true);
                            });
                        },
                        facetMatches: function (callback) {
                            callback(['country', 'mmsi', 'name', 'type'], {preserveOrder: true});
                        },
                        valueMatches: function (facet, searchTerm, callback) {
                            switch (facet) {
                                case 'country':
                                    callback(countryList, {preserveOrder: true});
                                    break;
                                case 'type':
                                    callback(shipTypes, {preserveOrder: true});
                                    break;
                            }
                        }
                    }
                });

                $scope.params = AisQueryService.getSearchParams();
                $scope.sourceFilter.searchBox.value($scope.params.sourceTxt || '');
                $scope.targetFilter.searchBox.value($scope.params.targetTxt || '');
            };

            // ****************************************
            // ** Source Filtering
            // ****************************************

            /**
             * Called when the source filter has been updated
             */
            $scope.updateSourceFilter = function (updateDownloadUrl) {
                // Reset filter params
                $scope.params.sourceTxt = $scope.sourceFilter.searchBox.value();
                $scope.params.sourceBs = [];
                $scope.params.sourceCountries = [];
                $scope.params.sourceRegions = [];

                var facets = $scope.sourceFilter.searchQuery.facets();
                for (var f in facets) {
                    var facet = facets[f];
                    if (facet.type) {
                        // TODO
                    } else if (facet.bs) {
                        $scope.params.sourceBs.push(facet.bs);
                    } else if (facet.country) {
                        $scope.params.sourceCountries.push(facet.country);
                    } else if (facet.region) {
                        $scope.params.sourceRegions.push(facet.region);
                    }
                }

                if (updateDownloadUrl) {
                    $scope.updateDownloadUrl();
                }
            };

            /**
             * Called when the target filter has been updated
             */
            // ****************************************
            // ** Target Filtering
            // ****************************************

            $scope.updateTargetFilter = function (updateDownloadUrl) {
                // Reset filter params
                $scope.params.targetTxt = $scope.targetFilter.searchBox.value();
                $scope.params.targetCountries = [];
                $scope.params.targetMmsi = [];
                $scope.params.targetNames = [];
                $scope.params.targetTypes = [];

                var facets = $scope.targetFilter.searchQuery.facets();
                for (var f in facets) {
                    var facet = facets[f];
                    if (facet.country) {
                        $scope.params.targetCountries.push(facet.country);
                    } else if (facet.mmsi) {
                        $scope.params.targetMmsi.push(facet.mmsi);
                    } else if (facet.name) {
                        $scope.params.targetNames.push(facet.name);
                    } else if (facet.type) {
                        $scope.params.targetTypes.push(facet.type);
                    }
                }

                if (updateDownloadUrl) {
                    $scope.updateDownloadUrl();
                }
            };

            // ****************************************
            // ** Time interval
            // ****************************************

            $scope.$watch(
                function () {
                    return $scope.params.startDate;
                },
                function (a) {
                    $scope.validateTimeInterval(true);
                },
                true);

            $scope.$watch(
                function () {
                    return $scope.params.endDate;
                },
                function (a) {
                    $scope.validateTimeInterval(false);
                },
                true);

            $scope.validateTimeInterval = function (startDateUpdated) {

                if (startDateUpdated && $scope.params.startDate > $scope.params.endDate) {
                    $scope.params.endDate = moment($scope.params.startDate).add(10, 'minutes').valueOf()
                } else if (!startDateUpdated && $scope.params.startDate > $scope.params.endDate) {
                    $scope.params.startDate = moment($scope.params.endDate).add(-10, 'minutes').valueOf()
                }

                $scope.updateDownloadUrl();
            };


            // ****************************************
            // ** Area Filtering
            // ****************************************

            $scope.showAreaMap = false;

            /**
             * Called when the area has been updated
             * @param coordinates the new coordinates
             */
            $scope.updateArea = function (coordinates) {
                function max(m1, m2) {
                    return (m2 === undefined) ? m1 : Math.max(m1, m2);
                }

                function min(m1, m2) {
                    return (m2 === undefined) ? m1 : Math.min(m1, m2);
                }

                $scope.params.area.maxLat = $scope.params.area.maxLon = $scope.params.area.minLat = $scope.params.area.minLon = undefined;
                if (coordinates && coordinates.length > 0) {
                    for (var c in coordinates) {
                        var latLon = coordinates[c];
                        $scope.params.area.maxLat = max(latLon[1], $scope.params.area.maxLat);
                        $scope.params.area.maxLon = max(latLon[0], $scope.params.area.maxLon);
                        $scope.params.area.minLat = min(latLon[1], $scope.params.area.minLat);
                        $scope.params.area.minLon = min(latLon[0], $scope.params.area.minLon);
                    }
                }
            };

            /**
             * Clears the selected area
             */
            $scope.clearArea = function () {
                $scope.updateArea(undefined);
            };

            /**
             * Returns if the area is well-defined
             * @returns {*}
             */
            $scope.areaDefined = function () {
                var a = $scope.params.area;
                return a.maxLat && a.maxLon && a.minLat && a.minLon;
            };

            // ****************************************
            // ** Output Format
            // ****************************************

            $scope.$watch(
                function () {
                    return $scope.params.outputFormat;
                },
                function (a) {
                    $scope.updateDownloadUrl();
                },
                true);

            // ****************************************
            // ** Downloading
            // ****************************************

            $scope.downloadUrl = '';

            function encodeValues(values) {
                var enc = [];
                for (var v in values) {
                    enc.push(encodeURIComponent(values[v]));
                }
                return enc;
            }

            /**
             * Updates the download URL
             */
            $scope.updateDownloadUrl = function () {

                var url = 'interval=' + moment($scope.params.startDate).utc().format('YYYY-M-DTHH:mm:ss') + 'Z'
                    + '/' + moment($scope.params.endDate).utc().format('YYYY-M-DTHH:mm:ss') + 'Z';

                var filter = false;
                if ($scope.params.sourceBs.length > 0) {
                    url += '&s.bs=' + encodeValues($scope.params.sourceBs).join();
                    filter = true;
                }
                if ($scope.params.sourceCountries.length > 0) {
                    url += '&s.country=' + $scope.params.sourceCountries.join();
                    filter = true;
                }
                if ($scope.params.sourceRegions.length > 0) {
                    url += '&s.region=' + encodeValues($scope.params.sourceRegions).join();
                    filter = true;
                }

                if ($scope.params.targetCountries.length > 0) {
                    url += '&t.country=' + $scope.params.targetCountries.join();
                    filter = true;
                }
                if ($scope.params.targetMmsi.length > 0) {
                    url += '&t.mmsi=' + encodeValues($scope.params.targetMmsi).join();
                    filter = true;
                }
                if ($scope.params.targetNames.length > 0) {
                    url += '&t.name=' + encodeValues($scope.params.targetNames).join();
                    filter = true;
                }
                if ($scope.params.targetTypes.length > 0) {
                    url += '&t.type=' + $scope.params.targetTypes.join();
                    filter = true;
                }
                if (filter) {
                    url += '&filter';
                }

                if ($scope.areaDefined()) {
                    var a = $scope.params.area;
                    url += '&box=' + a.maxLat.toFixed(3) + ',' + a.minLon.toFixed(3) + ','
                    + a.minLat.toFixed(3) + ',' + a.maxLon.toFixed(3);
                }

                if ($scope.params.outputFormat != 'raw') {
                    url += '&output=' + $scope.params.outputFormat;
                }

                $scope.downloadUrl = url;
            };

            /**
             * Main search method
             */
            $scope.download = function () {
                $scope.updateSourceFilter(false);
                $scope.updateTargetFilter(false);
                $scope.updateDownloadUrl();

                AisQueryService.execute(
                    $scope.downloadUrl,
                    function () {
                    },
                    function () {
                    });

                AisQueryService.saveSearchParams($scope.params);
                growlNotifications.add('Download Scheduled', 'info', 2000);
            };

            $scope.clear = function () {
                $scope.params = AisQueryService.clearParams();
                $scope.sourceFilter.searchBox.value($scope.params.sourceTxt || '');
                $scope.targetFilter.searchBox.value($scope.params.targetTxt || '');
            };

            $scope.reset = function () {
                AisQueryService.reset();
            };

            /**
             * Main search method
             */
            $scope.copy = function () {
                $scope.updateSourceFilter(false);
                $scope.updateTargetFilter(false);
                $scope.updateDownloadUrl();
                window.prompt("Copy to clipboard:",
                    'https://ais2.e-navigation.net/aisview/rest/store/query?' + $scope.downloadUrl);
            }
        }])


    /**
     * The main AIS Download Results controller
     */
    .controller('AisResultsCtrl', ['$scope', '$interval', 'AisQueryService',
        function ($scope, $interval, AisQueryService) {
            'use strict';

            $scope.badgeColor = 'blue';
            $scope.resultsContent = '';
            $scope.files = [];
            $scope.clientId = AisQueryService.clientId();

            // Refresh the list of files every 5 seconds
            $interval(function () { $scope.updateFiles(); }, 5000);

            /**
             * Updates the list of files from the backend
             */
            $scope.updateFiles = function () {
                AisQueryService.listFiles(
                    function(files) {
                        $scope.files = files;
                        $scope.badgeColor = 'blue';
                        for (var f in $scope.files) {
                            if (!$scope.files[f].complete) {
                                $scope.badgeColor = 'red';
                            }
                        }
                    },
                    function (err) {
                        console.error("Error fetching files " + err);
                    });
            };

            // Initial loading of files
            $scope.updateFiles();

            /**
             * Opens the given file
             * @param file the file to open
             */
            $scope.openFile = function (file) {
                window.open('/query/file/' + file.path);
            };

            /**
             * Deletes the given file
             * @param file the file to delete
             */
            $scope.deleteFile = function (file) {
                AisQueryService.deleteFile(
                    file.path,
                    function (result) { $scope.updateFiles(); },
                    function () { $scope.updateFiles(); });
            }

    }]);
