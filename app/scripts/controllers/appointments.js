'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:AppointmentCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('AppointmentCtrl', function($scope, $global, authentication, $state, growl, dashboard, ngTableParams,$uibModal,$log) {
        $scope.pendingAppointments =function() {
            $scope.pendingParams = new ngTableParams({
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
                        "fromdate": "TODAY",
                        "status": "pending"
                    };
                    dashboard.pendingRequests(queryParams).then(function(res) {
                        console.log(res.data.sells.length);

                        if (res.data.sells.length > 0) {
                            params.total(res.data.sells.length);
                            $defer.resolve(res.data.sells.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        } else {
                            $defer.resolve(res.data.sells);
                            $scope.pending = "Pending Appointments Not found";
                        }


                    });
                }
            });
        };

        $scope.completedAppointments = function(){
            $scope.completedParams = new ngTableParams({
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
                        "fromdate": "TODAY",
                        "status": "completed"
                    };
                    dashboard.pendingRequests(queryParams).then(function(res) {
                        console.log(res.data.sells.length);

                        if (res.data.sells.length > 0) {
                            params.total(res.data.sells.length);
                            $defer.resolve(res.data.sells.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        } else {
                        	$defer.resolve(res.data.sells);
                            $scope.completed = "Completed Appointments Not found";
                        }


                    });
                }
            });
        };
        $scope.unassignedAppointments = function(){
            $scope.unassignedParams = new ngTableParams({
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
                        "fromdate": "TODAY",
                        "status": "unassigned"
                    };
                    dashboard.pendingRequests(queryParams).then(function(res) {
                        console.log(res.data.sells.length);

                        if (res.data.sells.length > 0) {
                            params.total(res.data.sells.length);
                            $defer.resolve(res.data.sells.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        } else {
                        	$defer.resolve(res.data.sells);
                            $scope.unassigned = "Unassigned Appointments Not found";
                        }


                    });
                }
            });
        };
        $scope.pendingAppointments();
        $scope.completedAppointments();
        $scope.unassignedAppointments();
         $scope.OpenRequest = function(pickup) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/pending-request-modal.html',
                controller: 'PendingRequestModalCtrl',
                size: "lg",
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
               $scope.unassignedAppointments();
            });
        };
          $scope.requestModel = function(pickup) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/consumer-pickups-modal.html',
                controller: 'ConsumerPickupsModalCtrl',
                size: "lg",
                resolve: {
                    items: function() {

                        return pickup;
                    }
                }
            });

            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    });
