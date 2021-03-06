'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:CancelledCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('CancelledCtrl', function($scope, $moment, $uibModal, $global, dashboard, SellNow, ngTableParams, $log, $stateParams, agentAppointments) {
        $scope.date = {
            startDate: moment($stateParams.fromdate),
            endDate: moment($stateParams.todate)
        };
        $scope.opts = {
            locale: {
                applyClass: 'btn-green',
                applyLabel: "Apply",
                fromLabel: "From",
                format: "DD-MMM-YYYY",
                toLabel: "To",
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            ranges: {
                'Today': [moment(), moment()],
                'Tommorow': [moment().add(1, 'days'), moment().add(1, 'days')],
                'Next 7 Days': [moment(), moment().add(6, 'days')],
                'Next 30 Days': [moment(), moment().add(29, 'days')],
                'This Month': [moment().startOf('month'), moment().endOf('month')]
            }
        };
        $scope.setStartDate = function() {
            $scope.date.startDate = moment().subtract(4, "days").toDate();
        };

        $scope.setRange = function() {
            $scope.date = {
                startDate: moment().subtract(5, "days"),
                endDate: moment()
            };
        };
        $scope.vm = { params: {} };
        $scope.currentPage = 1;
        $scope.transactionChange = function() {
            $scope.totalAgentRecords = 0;
            $scope.currentPage = 1;
            $scope.vm.params.page = 0;
            $scope.vm.params.todate = $moment($scope.date.endDate).format('DD-MMM-YYYY');
            $scope.vm.params.fromdate = $moment($scope.date.startDate).format('DD-MMM-YYYY');
            $scope.vm.params.status = 'CANCELLED_BY_CONSUMER';
            $scope.cancelled($scope.vm.params);
        };
        //Watch for date changes
        $scope.$watch('date', function(newDate) {

            $scope.transactionChange();

        }, false);

        $scope.nextDate = function() {
            $scope.date = {
                startDate: moment($scope.date.endDate).add(1, "days"),
                endDate: moment($scope.date.endDate).add(1, "days")
            };
            // $scope.transactionChange();
        }
        $scope.previousDate = function() {
            $scope.date = {
                startDate: moment($scope.date.startDate).subtract(1, "days"),
                endDate: moment($scope.date.startDate).subtract(1, "days")
            };
            // $scope.transactionChange();
        }

        $scope.pageChanged = function(currentPage) {
            $scope.pageNumber = currentPage - 1;
            $scope.cancelled($scope.vm.params);
        }
        $scope.cancelled = function(params) {
            SellNow.pendingRequests(params).then(function(res) {
                $scope.totalAgentRecords = res.data.totalRecords;
                $scope.cancelledSells = res.data.sells;

            });
        };

        $scope.OpenRequest = function(pickup) {
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
                $scope.vm.params.page = 0;
                $scope.vm.params.todate = $moment($scope.date.endDate).format('DD-MMM-YYYY');
                $scope.vm.params.fromdate = $moment($scope.date.startDate).format('DD-MMM-YYYY');
                $scope.vm.params.status = 'CANCELLED_BY_CONSUMER';
                $scope.cancelled($scope.vm.params);
            });
        }
    });
