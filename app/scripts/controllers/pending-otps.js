'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:PendingOtpsCtrl
 * @description
 * # PendingOtpsCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
     .controller('PendingOtpsCtrl', function($scope, $uibModal, $global, pendingOtps, ngTableParams) {
        
        $scope.tableParams = new ngTableParams({
             page: 1,
            count: 8,
            paginate: true,
        }, {
            getData: function($defer, params) {
                 var pageNumber = params.page();
                    var pageSize = params.count();
                    var queryParams = {
                       "size": pageSize,
                       "page": pageNumber,
                        "status":"completed"
                    };
                pendingOtps.getPendingOtps(queryParams).then(function(res) {
                    //console.log(res);
                    //console.log(res.data.userList.length);
                    if(res.data.users.length>0){
                        //params.total(res.data.users.length);
                         params.total(res.data.totalRecords);
                        $defer.resolve(res.data.users);
                        //$defer.resolve(res.data.users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                    else {
                        $scope.noComplaints = "No Pending Registrations found";
                    }
                });
            }
        });
        $scope.openOtp = function(size) {
            var otpInstance = $uibModal.open({
                templateUrl: 'views/panding-otp-modal.html',
                controller: 'PendingOtpModalCtrl',
                size: "md",
                resolve: {
                    items: function() {
                        return size;
                    }
                }
            });
            otpInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {

            });
        };

    });
