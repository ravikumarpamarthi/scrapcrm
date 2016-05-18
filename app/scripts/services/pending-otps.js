'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.pendingOtps
 * @description
 * # pendingOtps
 * Factory in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .factory('pendingOtps', function(httpService, $global) {
        return {
            getPendingOtps: function() {
                var params = {};
                params.status = 'pending';
                var params = "?" + $global.objToQueryString(params);
                var url = $global.getApiUrl() + $global.getApiObject().pendingOtps + params;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            }
        };
    });
