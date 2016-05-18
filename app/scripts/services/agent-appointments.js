'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.agentAppointments
 * @description
 * # agentAppointments
 * Factory in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .factory('agentAppointments', function(httpService, $global) {
        // Service logic
        // ...



        // Public API here
        return {
            getAgentAppointments: function() {
                var url = $global.getApiUrl() + $global.getApiObject().agentsAppointments;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },todayAppointments: function() {
                var url = $global.getApiUrl() + $global.getApiObject().todayAppointments;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            }
        };
    });
