'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.products
 * @description
 * # products
 * Factory in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .factory('products', function(httpService, $global) {
        // Service logic
        // ...

        //var meaningOfLife = 42;

        // Public API here
        return {
            getProducts: function() {
                var url = $global.getApiUrl() + $global.getApiObject().products;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            addProduct: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().addProducts;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            editProduct: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().editProduct.replace(":id", id);
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            updateProduct: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().updateProducts;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            priceUpdate: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().priceUpdate;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
        };
    });
