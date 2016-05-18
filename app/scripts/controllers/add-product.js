'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:AddProductCtrl
 * @description
 * # AddProductCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('AddProductCtrl', function($scope, products, Upload, httpService, $state, $global, $http, growl, $filter) {
        $scope.url = $global.getApiUrl() + '/fileManager/uploadFile';
        //$scope.url = $global.getApiUrl() + '/agentsData/import';
        $scope.upload = function(file) {
            $scope.submitted = true;
            if ($scope.addproduct.$valid) {
                var url = $scope.url;
                $scope.fileHash = false;
                $scope.progress = 0;
                $scope.hash = false;
                Upload.upload({
                    url: url,
                    file: file
                }).then(function(response) {

                    if (response.data.status == "SUCCESS") {
                        $scope.data.image = response.data.data.fileId;
                        products.addProduct($scope.data).then(function(res) {
                            if (res.status == "SUCCESS") {

                                growl.success("Successfully added");
                                $state.go('root.products');
                            } else if (res.status == "FAILURE") {

                            }
                        });
                    }
                    $scope.progress = 0;
                }, function(resp) {

                }, function(evt) {
                    var progressPercentage = $scope.progress = parseInt(100.0 * evt.loaded / evt.total);

                });
            };
        }
    });
