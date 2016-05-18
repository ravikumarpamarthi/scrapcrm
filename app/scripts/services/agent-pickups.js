'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.agentPickups
 * @description
 * # agentPickups
 * Factory in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .factory('agentService', function(httpService, $global, $http) {
        return {
            getAgentpickups: function() {
                var url = $global.getApiUrl() + $global.getApiObject().agentsPickups;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            getAgent: function(type,key) {
                var url = $global.getApiUrl() + $global.getApiObject().getAgent.replace(":userType", type).replace(":text", key);
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            usersLoad: function(type) {
                var url = $global.getApiUrl() + $global.getApiObject().usersLoad.replace(":userType", type);
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            getProfile: function(agentId) {
                var agentId = agentId;
                var url = $global.getApiUrl() + $global.getApiObject().getAgentProfile.replace(":aid", agentId);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSellRquests: function(agentId) {
                var params = "?" + $global.objToQueryString(agentId);
                var url = $global.getApiUrl() + $global.getApiObject().getSellRquests + params;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSellById: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().getSellById.replace(":id", id);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
        };


    });
