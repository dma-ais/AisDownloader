/**
 * The main AIS-downloader app module definition.
 *
 * Define the routes of the single page application.
 */

var app = angular.module('aisdownloader.app', [ 'ngSanitize', 'ui.bootstrap', 'leaflet-directive', 'ui.bootstrap.datetimepicker', 'growlNotifications' ]);




$(document).ready(function() {
/*
    // Initialize source filter
    window.sourceFilter = VS.init({
        container  : $('#sourceFilter'),
        query      : '',
        showFacets : true,
        unquotable : [],
        callbacks  : {
            search : function(query, searchCollection) {
                var scope = angular.element($("#aisQuery")).scope();
                scope.$apply(function() {
                    scope.updateSourceFilter(true);
                });
            },
            facetMatches : function(callback) {
                callback([ 'type', 'bs', 'country', 'region' ], {preserveOrder: true});
            },
            valueMatches : function(facet, searchTerm, callback) {
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
    window.targetFilter = VS.init({
        container  : $('#targetFilter'),
        query      : '',
        showFacets : true,
        unquotable : [],
        callbacks  : {
            search : function(query, searchCollection) {
                var scope = angular.element($("#aisQuery")).scope();
                scope.$apply(function() {
                    scope.updateTargetFilter(true);
                });
            },
            facetMatches : function(callback) {
                callback([ 'country', 'mmsi', 'name', 'type' ], {preserveOrder: true});
            },
            valueMatches : function(facet, searchTerm, callback) {
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
*/
});
