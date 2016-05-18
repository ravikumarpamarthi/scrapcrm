'use strict';

angular.module('scrapQcrmApp')
    .factory('authentication', function($global, httpService) {
        return {
            register: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().signup;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            login: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().login;
                var val = data.userName + ':' + data.password;
                var header = $global.getLoginAuthorization(val);

                var $request = httpService.httpLogin(url, header);
                return $request;
            },
            logout: function() {
                var url = $global.getApiUrl() + $global.getApiObject().logout;
                var $request = httpService.httpRequest(url, "P", "");
                return $request;
            },
            otpVerification: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().otpVerification;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            saveCosumerAddress: function(data) {
                var consumerId = $global.consumerId;
                var url = $global.getApiUrl() + $global.getApiObject().saveAddress;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
             complaintCategories: function() {
                var url = $global.getApiUrl() + $global.getApiObject().complaintsCategory;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            complaintsType: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().complaintsType.replace(":cid", id);
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            complaintsSave: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().saveComplaints;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },

        };
    });
