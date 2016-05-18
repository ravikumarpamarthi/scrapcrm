'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:EditProductCtrl
 * @description
 * # EditProductCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('EditProductCtrl', function($scope, httpService, products, $state, Upload, $global, growl, $stateParams) {
        $scope.edit = $global.getApiUrl() + '/fileManager/getImageFileById'
        products.editProduct($stateParams.id).then(function(res) {
            //console.log(res);
            if (res.status == "SUCCESS") {
                $scope.data = res.data.category;
            } else if (res.status == "FAILURE") {

            }
        });
        $scope.url = $global.getApiUrl() + '/fileManager/uploadFile';
        $scope.updateProduct = function(file) {
            var url = $scope.url;
            $scope.fileHash = false;
            $scope.progress = 0;
            $scope.hash = false;
            $scope.submitted = true;
            if ($scope.editProduct.$valid) {
                // httpService.httpUploadRequest($scope.url, file, $scope.data);
                if (file) {
                    Upload.upload({
                        url: url,
                        // fields: $scope.data,
                        file: file
                    }).then(function(response) {
                        //if (response.status == "SUCCESS") {
                        $scope.data.image = response.data.data.fileId;
                        products.updateProduct($scope.data).then(function(res) {
                            if (res.status == "SUCCESS") {
                                growl.success("Successfully updated");
                                $state.go('root.products');
                            } else if (res.status == "FAILURE") {

                            }
                        });
                        //}
                        /*  if (response.data.res == "exists") {
                              $scope.fileHash = response.data.data;
                          } else {
                              $scope.hash = response.data;
                              $scope.picFile = null;
                              // growl.success("File Submitted for Analysis. Please use the Hash Key given below to retrieve the Analysis Result after some time.");
                          }*/
                        $scope.progress = 0;
                    }, function(resp) {
                        // console.log('Error status: ' + resp.status);
                    }, function(evt) {
                        var progressPercentage = $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    }); /**/
                } else {
                    products.updateProduct($scope.data).then(function(res) {
                        if (res.status == "SUCCESS") {
                            growl.success("Successfully updated");
                            $state.go('root.products');
                        } else if (res.status == "FAILURE") {

                        }
                    });
                }
            };
        };
        $scope.priceUpdate = function() {
            $scope.price = {
                "categoryId": $scope.data.categoryId,
                "price": $scope.data.price
            };
            products.priceUpdate($scope.price).then(function(res) {
                if (res.status == "SUCCESS") {
                    growl.success("Successfully updated")
                } else if (res.status == "FAILURE") {

                }
            });
        }
    });
