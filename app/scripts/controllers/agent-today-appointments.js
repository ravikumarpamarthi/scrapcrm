'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AgentTodayAppointmentsCtrl
 * @description
 * # AgentTodayAppointmentsCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('AgentTodayAppointmentsCtrl', function($scope, $uibModalInstance,$uibModal, items, agentService) {
        
        
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }; 
        $scope.ok = function() {
            $uibModalInstance.close('ok');
        };
       $scope.init=function(){
        agentService.getSellById(items.confirmationId).then(function(res) {
            $scope.items = res.data.sell

        });
       }
       $scope.init();
        
/*$scope.declineSellItem = function(sell, index) {
    var pickupInstance = $uibModal.open({
                templateUrl: 'views/deleteConfirmation.html',
               controller:"Contorller"
                size: "md",
                resolve: {
                    items: function() {

                        return ;
                    }
                }
            });

            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
                  if (res) {
                            var obj = {
                                'sellObjId': sell.sellObjId,
                                'agentObjId': sell.agentObjId,
                            }
                            sellRequests.declineRequest(obj).then(function(res) {
                                if (res.status == $global.SUCCESS) {
                                    $scope.pendingSells.splice(index, 1);
                                    $global.showToastMessage(res.data.message, 'short', 'center');

                                }
                            })
                        }
            });
                    var declineConfirmation = $ionicPopup.confirm({
                        title: 'Alert',
                        template: 'Do you want to decline Appointment?',
                        okType: 'button-assertive'
                    });
                    declineConfirmation.then(function(res) {
                        if (res) {
                            var obj = {
                                'sellObjId': sell.sellObjId,
                                'agentObjId': sell.agentObjId,
                            }
                            sellRequests.declineRequest(obj).then(function(res) {
                                if (res.status == $global.SUCCESS) {
                                    $scope.pendingSells.splice(index, 1);
                                    $global.showToastMessage(res.data.message, 'short', 'center');

                                }
                            })
                        }
                    });
                };
    $scope.editAgentDetails=function(){
          var modalInstance = $uibModal.open({
                templateUrl: 'views/add-items.html',
                controller: 'AddItemsCtrl',
                size: "lg",
                resolve: {
                    items: function() {
                        return $scope.items.confirmationId;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                $scope.init();
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
    }
    $scope.rescheduleConfirmation = function(sell, index) {
                    var confirm = $window.confirm({
                        title: 'Alert',
                        template: 'Do you want to reschedule Appointment?',
                        okType: 'button-assertive'
                    });
                    confirm.then(function(res) {
                        if (res) {
                            $scope.reschedule = {
                                'sellObjId': sell.sellObjId,
                                'agentObjId': sell.agentObjId,
                            }
                            $scope.showRescheduleModal(sell.preferredSlot);
                        }
                    });
                };*/
    });
