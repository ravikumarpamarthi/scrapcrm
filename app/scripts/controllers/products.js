'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('ProductsCtrl', function($scope, products, ngTableParams, $state, $global, envService) {
        $scope.edit = $global.getApiUrl() + '/fileManager/getImageFileById';
        $scope.editProduct = function(id) {
            $state.go('root.edit-product', { id: id });
        };
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            filter: { name: "T" }
        }, {
            getData: function($defer, params) {
                var receiveData = function(data, responseHeaders) {
                    // in my case, the server returns the total number of rows as a response header
                    // call params.total(...) to tell ng-table the total number of rows
                    params.total(4);

                    // the server returns just the data for the current page, so can send it as is
                    $defer.resolve(data);
                };

                // getData gets called when you click on a different page in the pagination links.
                // get the page number and size from params.$params
                // var pageNumber = params.$params.page;
                // var pageSize = params.$params.count;

                // // set up the query parameters as expected by your server
                // var queryParams = {
                //     "paging.pageSize": pageSize,
                //     "paging.pageNumber": pageNumber
                // };

                // send an ajax request to your server. in my case MyResource is a $resource.
                products.getProducts().then(function(res) {
                    if (res.data.categories) {
                        $defer.resolve(res.data.categories);
                    }

                });
            }
        });

    });
