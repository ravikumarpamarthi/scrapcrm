'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:PendingRequestsCtrl
 * @description
 * # PendingRequestsCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('TodayAppointmentsCtrl', function($scope, $uibModal, $global, dashboard, ngTableParams, $log) {
        $scope.pendingRequests=function(){
        $scope.tableParams = new ngTableParams({
            //page: 1,
            count: 10,
            paginate: true,
        }, {
            getData: function($defer, params) {
                 var pageNumber = params.page();
                    var pageSize = params.count();
                    var queryParams = {
                       "size": pageSize,
                       "page": pageNumber,
                       "fromdate":"TODAY",
                        "status":"unassigned"
                    };
                dashboard.pendingRequests(queryParams).then(function(res) {
                    console.log(res.data.sells.length);
                    
                    if (res.data.sells.length > 0) {
                            params.total(res.data.sells.length);
                    $defer.resolve(res.data.sells.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                        else {
                        $scope.noComplaints = "No pendingRequests found";
                    }
                    

                });
            }
        });
    };
    $scope.pendingRequests();
        $scope.OpenRequest = function(pickup) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/pending-request-modal.html',
                controller: 'PendingRequestModalCtrl',
                size: "md",
                resolve: {
                    items: function() {

                        return pickup.confirmationId;
                    }
                }
            });

            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
                 $scope.pendingRequests();
            });
        }

    });
