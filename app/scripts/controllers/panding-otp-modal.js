'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:PandingOtpModalCtrl
 * @description
 * # PandingOtpModalCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('PendingOtpModalCtrl', function($scope, $uibModalInstance, items) {

        $scope.items = items;
        $scope.ok = function(data) {
            $uibModalInstance.close(data);

        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.validate = function() {
            $scope.isOtpCode = $scope.otpForm.otp.$error.required;


        };
        $scope.save = function() {
            $scope.submit = true;
            if ($scope.otpForm.$valid) {
                $scope.data.id = items.id;
                console.log($scope.data);
                $uibModalInstance.close($scope.data);
                return false;
            }
            $scope.submit = true;
        };
    });
