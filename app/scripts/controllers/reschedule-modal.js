'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('ReschduleCtrl', function($scope,$uibModalInstance, $moment, $global, authentication, SellNow, $state, growl, items) {
        $scope.reschedule = items;
        // $scope.reschedule.preferredDate = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY');
       $scope.ok = function(data) {
            $uibModalInstance.close(data);

        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.vm = {
            opened: false,
            // minDate: new Date()
        };

        $scope.openDatePicker = function() {
            $scope.vm.opened = true;
        }
        var disabledDate = 1;

        SellNow.getSlots().then(function(res) {
            $scope.allslots = res.data;
            $scope.slots = res.data.presentDaySlots;
            for (var i = $scope.slots.length - 1; i >= 0; i--) {
                if ($scope.slots[i].status != "Disabled") {
                    $scope.reschedule.preferredSlot = $scope.slots[i].slotId;
                    break;
                }
            };
            $scope.dateOptions = {};
            if (!$scope.reschedule.preferredSlot) {
                $scope.slots = res.data.allSlots;
                $scope.reschedule.preferredSlot = $scope.slots[0].slotId;
                var date = new Date();
                $scope.dateOptions.minDate = $scope.reschedule.preferredDate = date.setDate(date.getDate() + 1);;
            } else {
                $scope.dateOptions.minDate = $scope.reschedule.preferredDate = new Date();
            }

            // $scope.datepickerObjectPopup.inputDate = $moment($scope.vm.minDate).format('DD-MMM-YYYY');


        }, function(err) {

        });


        $scope.submitReschedule = function() {
            $scope.reschedule.preferredDate = $moment($scope.reschedule.preferredDate).format('DD-MMM-YYYY');
            SellNow.reschedule($scope.reschedule).then(function(res) {
                if (res.status == 'SUCCESS') {
                    // $global.showToastMessage(res.data.message, 'short', 'center');
                   $scope.ok('ok');
                } else if (res.status == 'FAILURE') {
                    // $global.showToastMessage(res.error.message, 'short', 'center');
                }
            })
        }
    });
