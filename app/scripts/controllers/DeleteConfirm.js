'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('DeleteCtrl', function($scope, authentication, $uibModalInstance, items, SellNow, growl) {
        $scope.items = items;
        $scope.items.agentObjId = items.agentObjId;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.ok = function(res) {
            $uibModalInstance.close(res);
        };
        $scope.decline = function() {

            var obj = {
                'sellObjId': items.sellObjId,
                'agentObjId': items.agentObjId,
            }
            $scope.items.agentObjId = true;
            SellNow.declineRequest(obj).then(function(res) {
                if (res.status = "SUCCESS") {
                    // $scope.todayAppointment.splice(index, 1);
                    growl.success(res.data.message);
                    $scope.ok(res);
                } else if (res.status == "FAILURE") {
                    growl.error(res.error.errors[0].message);
                }

            })


        };
        $scope.cancelSell = function() {
            var id = $scope.items.confirmationId;
            $scope.items.agentObjId = true;            
            SellNow.cancelSellRquests(id).then(function(res) {
                if (res.status = "SUCCESS") {
                    // $scope.todayAppointment.splice(index, 1);
                    growl.success(res.data.message);
                    $scope.ok(res);
                } else if (res.status == "FAILURE") {
                    growl.error(res.error.errors[0].message);
                }

            })


        };
    });
