/**
 * The main AIS-Downloader directives
 */
angular.module('aisdownloader.app')

    .directive('aisMap', ['$rootScope', function ($rootScope) {
        'use strict';

        return {
            restrict: 'A',

            transclude: true,

            templateUrl: 'partials/area-map.html',

            scope: {
                area: '=area'
            },

            link: function (scope, element, attrs) {

                var zoom = 6;
                var lon = 12.568;
                var lat = 55.676;
                var quiescent = false;

                var proj4326 = new OpenLayers.Projection("EPSG:4326");
                var projmerc = new OpenLayers.Projection("EPSG:900913");

                /*********************************/
                /* Layers                        */
                /*********************************/
                var boxLayer = new OpenLayers.Layer.Vector("Box");
                var osmLayer = new OpenLayers.Layer.OSM("OSM", [
                    '//a.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    '//b.tile.openstreetmap.org/${z}/${x}/${y}.png',
                    '//c.tile.openstreetmap.org/${z}/${x}/${y}.png' ], null);

                /*********************************/
                /* Map                           */
                /*********************************/
                var map = new OpenLayers.Map({
                    div: angular.element(element.children()[0])[0],
                    theme: null,
                    layers: [ osmLayer, boxLayer ],
                    units: "degrees",
                    projection: projmerc,
                    center: new OpenLayers.LonLat(lon, lat).transform(proj4326, projmerc),
                    zoom: zoom
                });

                /*********************************/
                /* Controls                      */
                /*********************************/

                var boxControl = new OpenLayers.Control.DrawFeature(boxLayer,
                    OpenLayers.Handler.RegularPolygon, {
                        handlerOptions: {
                            sides: 4,
                            irregular: true
                        }
                    });
                map.addControl(boxControl);

                scope.boxActive = false;

                scope.$watch(
                    function () { return scope.boxActive; },
                    function (active) {
                        if (active) {
                            boxControl.activate();
                        } else {
                            boxControl.deactivate();
                        }
                    }, true);

                /*********************************/
                /* Handle feature events         */
                /*********************************/
                boxLayer.events.on({
                    "featureadded": function (evt) {
                        readFeatureGeometry(evt);
                        scope.boxActive = false;
                    }
                });

                // Called when "featureadded" or "featuremodified" is fired in the box layer.
                // Updates the area from the OpenLayers features.
                function readFeatureGeometry(evt) {
                    if (quiescent) {
                        return;
                    }

                    function max(m1, m2) { return (m2 === undefined) ? m1 : Math.max(m1, m2); }
                    function min(m1, m2) { return (m2 === undefined) ? m1 : Math.min(m1, m2); }

                    var vertices = evt.feature.geometry.getVertices();
                    for (var i in  vertices) {
                        var pt = vertices[i].transform(projmerc, proj4326);
                        scope.area.maxLon = max(pt.x, scope.area.maxLon);
                        scope.area.maxLat = max(pt.y, scope.area.maxLat);
                        scope.area.minLon = min(pt.x, scope.area.minLon);
                        scope.area.minLat = min(pt.y, scope.area.minLat);
                    }

                    if(!scope.$$phase) {
                        scope.$apply();
                    }
                }

                /*********************************/
                /* Handle changed location       */
                /*********************************/

                function createPoint(lon, lat) {
                    return new OpenLayers.Geometry.Point(lon, lat).transform(proj4326, projmerc);
                }

                // Triggers when the model has been changed
                scope.$watch(function () {
                    return scope.area;
                }, function (area) {
                    boxLayer.removeAllFeatures();

                    // Adding OpenLayers features based on the location model
                    // will actually cause "featureadded" events. Setting the
                    // "quiescent" will stop us from converting features back
                    // into a model upon receiving this event.
                    quiescent = true;
                    if (area.maxLat && area.maxLon && area.minLat && area.minLon) {
                        try {
                            var points = [];
                            points.push(createPoint(area.minLon, area.minLat));
                            points.push(createPoint(area.minLon, area.maxLat));
                            points.push(createPoint(area.maxLon, area.maxLat));
                            points.push(createPoint(area.maxLon, area.minLat));
                            var features = [];
                            features.push(new OpenLayers.Feature.Vector(
                                new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points)])
                            ));
                            boxLayer.addFeatures(features);
                        } catch (ex) {
                            console.error("Error: " + ex);
                        }
                    }
                    quiescent = false;
                }, true);

            }
        }
    }])


    .directive('latitude', function() {
        return positionDirective('latitude', formatLatitude, parseLatitude);
    })

    .directive('longitude', function() {
        return positionDirective('longitude', formatLongitude, parseLongitude);
    });


function positionDirective(directive, formatter1, parser) {
    function formatter(value) {
        if (value || value === 0) return formatter1(value);
        return null;
    }

    return {
        require : '^ngModel',
        restrict : 'A',
        link : function(scope, element, attr, ctrl) {
            ctrl.$formatters.unshift(function(modelValue) {
                if (!modelValue) {
                    return null;
                }
                return formatter(modelValue);
            });

            ctrl.$parsers.unshift(function(valueFromInput) {
                try {
                    var val = parser(valueFromInput);
                    ctrl.$setValidity(directive, true);
                    return val;
                } catch (e) {
                    ctrl.$setValidity(directive, false);
                    return undefined;
                }
            });

            element.bind('change', function(event) {
                if (!ctrl.$modelValue) {
                    ctrl.$viewValue = null;
                }
                ctrl.$viewValue = formatter(ctrl.$modelValue);
                ctrl.$render();
            });

        }
    };
}
