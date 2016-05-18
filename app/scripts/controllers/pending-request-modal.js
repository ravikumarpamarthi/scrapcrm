'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:PendingRequestModalCtrl
 * @description
 * # PendingRequestModalCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('PendingRequestModalCtrl', function($scope, $uibModalInstance, items, consumer) {
        $scope.items = items;
        $scope.data = {};

        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        //sellObjId,agentObjId
        consumer.getSellById($scope.items).then(function(res) {

            $scope.items = res.data.sell;
            $scope.data.sellObjId = $scope.items.sellObjId;
        });
        consumer.pendingAgents().then(function(res) {
            $scope.pendingAgents = res.data.users;
        });
        $scope.submit = function() {
            if ($scope.data.agentObjId) {
                consumer.assignAgent($scope.data).then(function(res) {
                    $uibModalInstance.dismiss(res);
                })

            } else {
                $scope.objName = "Please Select Agent";
            }

        };
         $scope.rejected=function(confirm){
            
         consumer.rejectAgent(confirm).then(function(res){
            $uibModalInstance.dismiss(res);
         })
     }

    });
