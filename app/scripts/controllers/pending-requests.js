'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:PendingRequestsCtrl
 * @description
 * # PendingRequestsCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('PendingRequestsCtrl', function($scope, $moment, $uibModal, $global, dashboard, SellNow, $log, $stateParams, agentAppointments, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.date = {
            startDate: $moment($stateParams.fromdate,'DD-MMM-YYYY').toDate(),
            endDate: $moment($stateParams.todate,'DD-MMM-YYYY').toDate()
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
            $scope.vm.params.status =  'ASSIGNED_TO_AGENT';// 'PENDING';   
            $scope.pendingRequests($scope.vm.params);
        };
        $scope.pageChanged = function(currentPage) {
            $scope.vm.params.page = currentPage - 1;
            $scope.pendingRequests($scope.vm.params);
        }
        $scope.pendingRequests = function(params) {
            SellNow.pendingRequests(params).then(function(res) {
                $scope.totalAgentRecords = res.data.totalRecords;
                $scope.pendingSells = res.data.sells;
            });
        }
        // document.getElementsByClassName('dataTables_empty').setAttribute('No Requests Found');

        $scope.length = 1000;
        $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withDisplayLength($scope.length);

        $scope.all = function() {
            $scope.paging = true;
            $scope.vm.params.page = -1;
            $scope.pendingRequests($scope.vm.params);
            
        }

        //Watch for date changes
        $scope.$watch('date', function(newDate) {

            $scope.transactionChange();

        }, false);

        $scope.nextDate = function() {
            $scope.paging = false;
            $scope.date = {
                startDate: moment($scope.date.endDate).add(1, "days"),
                endDate: moment($scope.date.endDate).add(1, "days")
            };
            // $scope.transactionChange();
        }
        $scope.previousDate = function() {
            $scope.paging = false;
            $scope.date = {
                startDate: moment($scope.date.startDate).subtract(1, "days"),
                endDate: moment($scope.date.startDate).subtract(1, "days")
            };
            // $scope.transactionChange();
        }

        $scope.OpenRequest = function(pickup) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/consumer-pickups-modal.html',
                controller: 'ConsumerPickupsModalCtrl',
                size: "lg",
                backdrop: 'static',
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
                $scope.pendingRequests($scope.vm.params);
            });
        }
    });
