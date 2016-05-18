'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.global
 * @description
 * # global
 * Service in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .service('$global', function(envService, localStorageService, $base64, geolocation, $rootScope, $q) {
        this.paymentModes = [{
            name: "Cash",
            value: "Cash"
        }];
        this.init = function() {
            this.apiToken = "";
            this.authentication = null;
            this.consumerId = null;
             this.rootprovide="root";
            var data = this.getLocalItem("authentication", true);
            if (data) {
                this.authentication = data.data;
                this.apiToken = data.data.apiToken;
                this.consumerId = data.data.userId;
                 
            }

        }

        this.apiUrl = envService.read("apiUrl");
        this.restApi = envService.read("restApi");

        this.paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            sort: null
        };
        this.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            useExternalPagination: true,
            useExternalSorting: true,
            enableGridMenu: true,
        };
        this.gridHeight = function(currentPage, pageSize, totalRecords) {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            var x = currentPage * pageSize;
            var currentPageItems;
            if (x < totalRecords) {
                currentPageItems = pageSize;
            } else {
                currentPageItems = pageSize - (currentPage * pageSize - totalRecords);
                if (currentPageItems == 0) {
                    currentPageItems = 10;
                }
            }
            return {

                height: ((currentPageItems * rowHeight) + 3 * headerHeight) + "px"
            }
        };
        this.getLocationByLatLng = function(latlng) {
            var deffered = $q.defer();
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({
                'location': latlng
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    deffered.resolve(results[0]);
                } else {
                    deffered.reject("unable to find location");
                }
            });
            return deffered.promise;
        }
        this.getPaginationParams = function(paginationOptions, paginationPageSize, uiGridConstants, searchText) {
            var offset = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
            var limit = paginationPageSize;
            var params = '?offset=' + offset + "&limit=" + limit;
            switch (paginationOptions.sort) {
                case uiGridConstants.ASC:
                    params += "&sort=asc" + "&field=" + paginationOptions.sortColumn;;
                    break;
                case uiGridConstants.DESC:
                    params += "&sort=desc" + "&field=" + paginationOptions.sortColumn;;
                    break;
            }
            if (searchText)
                params += ((params.indexOf('?') < 0) ? '?' : '&') + 'like=' + searchText;
            return params;
        }
        this.getAuthorization = function() {
            var authorization = {
                'Authorization': 'Basic' + this.apiToken,
                'Client-Type': 'WEB',
                'App-Id': 'CRMUSER'
            }
            return authorization;
        }
        this.getApiUrl = function() {
            return this.apiUrl;
        }
        this.getApiObject = function() {
            return this.restApi;
        }

        this.setLocalItem = function(key, value, encoded) {
            value = JSON.stringify(value);
            if (encoded) {
                value = $base64.encode(value)
            }
            localStorageService.set(key, value);
        }
        this.removeLocalItem = function(key) {
            localStorageService.remove(key);
        }
        this.getLocalItem = function(key, decoded) {
            var value = localStorageService.get(key);
            value = (value) ? JSON.parse((decoded) ? $base64.decode(value) : value) : null;
            return value;
        }
        this.getLoginAuthorization = function(val) {
            val = $base64.encode(val);
            var authorization = {
                'Authorization': 'Basic' + val,
                'Client-Type': 'WEB',
                'App-Id': 'CRMUSER'
            }
            return authorization;
        }
        this.objToQueryString = function(obj) {
            var k = Object.keys(obj);
            var s = "";
            for (var i = 0; i < k.length; i++) {
                s += k[i] + "=" + encodeURIComponent(obj[k[i]]);
                if (i != k.length - 1) s += "&";
            }
            return s;
        };


        this.init();
        $rootScope.getImageFileById = this.getApiUrl() + this.getApiObject().getImageFileById;
        this.setSellRequest = function(obj) {
            this.setLocalItem("sellReuestItems", obj, true);
            // this.sellRequestObj=obj;
        }
        this.getSellRequest = function() {
            var sellReuestItems = this.getLocalItem("sellReuestItems", true);
            return sellReuestItems;
        }
        this.removeSellRequest = function() {
            this.removeLocalItem("sellReuestItems");
        }
        this.getAddressObj = function(geolocation) {
            var address = {};
            var geometry = geolocation.geometry;
            address.latitude = geometry.location.lat();
            address.longitude = geometry.location.lng();
            for (var i = geolocation.address_components.length - 1; i >= 0; i--) {
                if (geolocation.address_components[i].types[0] == "locality") {
                    address.locality = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "administrative_area_level_1") {
                    address.state = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "country") {
                    address.country = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "postal_code") {
                    address.postalCode = geolocation.address_components[i].long_name;
                }
            };

            return address;
        }
        this.getCurrentLocation = function() {
            var deffered = $q.defer();
            var posOptions = {
                timeout: 5000,
                enableHighAccuracy: false
            };


            geolocation.getLocation(posOptions).then(function(data) {
                var latlng = {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude
                };

                deffered.resolve(latlng);
            });
            return deffered.promise;
        }
    });
