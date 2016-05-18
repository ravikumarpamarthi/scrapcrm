'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:BidsCtrl
 * @description
 * # BidsCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('BidsCtrl', function($scope, $uibModal, consumer, ngTableParams) {

        $scope.tableParams = new ngTableParams({
            // page:res.data.totalPages,
            count: 10,
            paginate: true,
        }, {
            getData: function($defer, params) {
                var pageNumber = params.page();
                var pageSize = params.count();
                var queryParams = {
                    "size": pageSize,
                    "page": pageNumber,
                    "status": "pending"
                };
                consumer.getBids(queryParams).then(function(res) {
                    if (res.status == 'SUCCESS') {
                        if (res.data.bids.length > 0) {
                            params.total(res.data.totalRecords);
                            $defer.resolve(res.data.bids);
                        }
                        else {
                        $scope.noComplaints = "No Bids found";
                    }

                    }
                }, function(err) {
                    //$ionicLoading.hide();
                })
            }
        });

        $scope.detailBid = function(bid) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/bids-modal.html',
                controller: 'BidsModalCtrl',
                size: "md",
                resolve: {
                    items: function() {

                        return bid;
                    }
                }
            });

            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });
        };

        $scope.openBid = function(size) {

            var bidInstance = $uibModal.open({
                templateUrl: 'views/show-bids.html',
                controller: 'ShowBidsCtrl',
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            bidInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });
        };
    });
