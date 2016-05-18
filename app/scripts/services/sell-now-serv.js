'use strict';
angular.module('scrapQcrmApp')
    .factory('SellNow', function($global, httpService) {
        return {
            sellNow: function(data, type) {
                if (type == "PICKUP")
                    var url = $global.getApiUrl() + $global.getApiObject().sellNowPickup;
                if (type == "DROP")
                    var url = $global.getApiUrl() + $global.getApiObject().sellNowDrop;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            getSellById: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().getSellById.replace(":id", id);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSlots: function() {
                var url = $global.getApiUrl() + $global.getApiObject().getSlots;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSellRquests: function(params) {
                var consumerId = $global.consumerId;
                params.consumerid = consumerId;
                params.page -= 1;
                var params = "?" + $global.objToQueryString(params);
                var url = $global.getApiUrl() + $global.getApiObject().getSellRquests + params;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getAgents: function(lat, lng) {
                var url = $global.getApiUrl() + $global.getApiObject().getAgentsByLatLng.replace(":lng", lng).replace(":lat", lat);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            cancelSellRquests: function(confirmationId) {
                var url = $global.getApiUrl() + $global.getApiObject().cancelSellRquests.replace(":cid", confirmationId);
                var $request = httpService.httpRequest(url, "P");
                return $request;
            },
            getAddress: function(id) {
                var consumerId = $global.consumerId;
                var url = $global.getApiUrl() + $global.getApiObject().getAddress + "?userid=" + id;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            saveCosumerAddress: function(data) {
                var consumerId = $global.consumerId;
                var url = $global.getApiUrl() + $global.getApiObject().saveAddress;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            updatePickup: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().updatePickup.replace(":sellId", data.sellId);
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            updateDrop: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().updateDrop.replace(":sellId", data.sellId);
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            updateSellItems: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().updateSellItems;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            completeSellItems: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().completeSellItems;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
              declineRequest:function(data){
                var url = $global.getApiUrl() + $global.getApiObject().declineRequest;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            reschedule:function(data){
                var url = $global.getApiUrl() + $global.getApiObject().reschedule;
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            pendingRequests: function(param) {
                var params = "?" + $global.objToQueryString(param);
                var url = $global.getApiUrl() + $global.getApiObject().pendingRequests + params;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            }
        };
    });
