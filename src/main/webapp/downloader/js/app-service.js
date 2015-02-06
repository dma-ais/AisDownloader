/**
 * Services that provides access to the AIS-Downloader backend
 */
angular.module('aisdownloader.app')


    .factory('AisQueryService', [ '$http', '$window',
        function($http, $window) {
        'use strict';

        var storage = $window.localStorage;
        var version = 1;

        return {

            reset : function () {
                storage.clear();
                $window.location.reload();
            },


            clientId : function () {
                var clientId = storage.clientId;
                if (!clientId) {
                    clientId = storage.clientId =
                        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                            .replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
                }
                return clientId;
            },

            getSearchParams: function() {
                var params;
                try { params = JSON.parse(storage.params); } catch (e) {}
                if (!params || params.version != version) {
                    params = this.clearParams();
                }
                return params;
            },

            clearParams: function () {
                return {
                    // Parametet version
                    version: version,

                    // Source Filter
                    sourceTxt: '', // Contains the visual search text
                    sourceBs : [],
                    sourceCountries : [],
                    sourceRegions : [],

                    // Target Filter
                    targetTxt: '', // Contains the visual search text
                    targetCountries : [],
                    targetMmsi : [],
                    targetNames : [],
                    targetTypes : [],

                    // Time Selection
                    startDate : moment().startOf('hour').valueOf(),
                    endDate : moment().startOf('hour').add(10, 'minutes').valueOf(),

                    // Area Selection
                    area : {
                        maxLat: undefined,
                        maxLon : undefined,
                        minLat: undefined,
                        minLon : undefined
                    },

                    // Output Format
                    outputFormat : 'raw',
                    limit: undefined
                }
            },

            saveSearchParams: function (params) {
                try { storage.params = JSON.stringify(params); } catch (e) {}
            },

            execute: function(params, success, error) {
                $http.get('/query/execute/' + this.clientId() + '?params=' + encodeURIComponent(params))
                    .success(success)
                    .error(error);
            },

            deleteFile: function(file, success, error) {
                $http.get('/query/delete/' + file)
                    .success(success)
                    .error(error);
            },

            listFiles: function(success, error) {
                $http.get('/query/list/' + this.clientId())
                    .success(success)
                    .error(error);
            }

        };
    }]);

