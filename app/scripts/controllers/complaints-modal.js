'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:ComplaintsModalCtrl
 * @description
 * # ComplaintsModalCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('ComplaintsModalCtrl', function($state, $scope, $uibModalInstance, items, dashboard) {
        //console.log(items);
        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };


        $scope.save = function() {
            $scope.submitted = true;
            if (!$scope.complaintForm.$valid) {
                return false;
            }
            var remarkData = {};
            remarkData.complaintId = items.complaintId;
            remarkData.remarks = $scope.data.complaintDescription;
            dashboard.complaintRemark(remarkData).then(function(res) {
                if (res.status == "SUCCESS") {
                    $uibModalInstance.dismiss('cancel');
                    $state.go('root.complaints', {}, { reload: true });
                }
            }, function(err) {

            })
        };
    });
