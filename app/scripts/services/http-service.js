'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.httpService
 * @description
 * # httpService
 * Factory in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .factory('httpService', function($http, $q, $global, Upload) {

        return {
            httpJsonp: function(url) {
                var deffered = $q.defer();
                $http.jsonp(url, {
                        headers: $global.getAuthorization()
                    })
                    .success(function(data) {
                        deffered.resolve(data);
                    }).error(function(error) {
                        deffered.reject(error);
                    });
                return deffered.promise;
            },
            httpLogin: function(url, header) {
                var deffered = $q.defer();
                $http.post(url, "", {
                    headers: header
                }).success(function(user) {
                    deffered.resolve(user);
                }, {
                    'Content-Type': 'application/json;charset=UTF-8'
                }).error(function(error) {
                    deffered.reject(error);;
                });
                return deffered.promise;
            },
            httpRequest: function(url, method, data) {
                var deffered = $q.defer();
                if (method == 'P') {
                    $http.post(url, data, {
                        headers: $global.getAuthorization()
                    }).success(function(user) {
                        deffered.resolve(user);
                    }).error(function(error) {
                        deffered.reject(error);;
                    });
                }
                if (method == 'PU') {
                    $http.put(url, data, {
                        headers: $global.getAuthorization()
                    }).success(function(user) {
                        deffered.resolve(user);
                    }).error(function(error) {
                        deffered.reject(error);;
                    });
                }
                if (method == 'G') {
                    $http.get(url, {
                        headers: $global.getAuthorization()
                    }).success(function(user) {
                        deffered.resolve(user);
                    }).error(function(error) {
                        deffered.reject(error);;
                    });
                }
                if (method == 'D') {
                    $http.delete(url, {
                        headers: $global.getAuthorization()
                    }).success(function(user) {
                        deffered.resolve(user);
                    }).error(function(error) {
                        deffered.reject(error);;
                    });
                }
                return deffered.promise;
            },
            httpUploadRequest: function(url, file, data) {
                var deffered = $q.defer();
                Upload.upload({
                    url: url,
                    method: 'POST',
                    data: data,
                    file: file
                }).success(function(data) {
                    deffered.resolve(data);
                }).error(function(error) {
                    deffered.reject(error);;
                });

                return deffered.promise;

            },

        };

    });
