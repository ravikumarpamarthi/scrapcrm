'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.dashboard
 * @description
 * # dashboard
 * Service in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .service('dashboard', function(httpService, $global) {
        return {

            statistics: function() {
                var url = $global.getApiUrl() + $global.getApiObject().dashboard;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            complaints: function(param) {
                 param.page-=1;
                var params = "?" + $global.objToQueryString(param);
                var url = $global.getApiUrl() + $global.getApiObject().complaints+ params;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            complaintRemark: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().complaintRemark;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            pendingRequests: function(param) {
                param.page-=1;
                var params = "?" + $global.objToQueryString(param);
                var url = $global.getApiUrl() + $global.getApiObject().pendingRequests + params;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },   
            unavailable: function(status) {
                
                var url = $global.getApiUrl() + $global.getApiObject().unavilable.replace(":status",status);
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            }, sellCount: function() {
                
                var url = $global.getApiUrl() + $global.getApiObject().sellCount;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            getCalendar: function(from,to) {
                var agentId=$global.agentId;
                var url = $global.getApiUrl() + $global.getApiObject().getCalendar.replace(":from",from).replace(":to",to);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            }

        };
    });
