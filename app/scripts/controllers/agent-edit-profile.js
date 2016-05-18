'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AgentEditProfileCtrl
 * @description
 * # AgentEditProfileCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('AgentEditProfileCtrl', function($scope, $uibModalInstance, items, growl, consumer) {
        $scope.data = items;
        $scope.defaultLocation = items.address.addressId;
        consumer.getAddress($scope.data.agentId).then(function(res) {
            $scope.locations = [];
            $scope.locations = res.data.addresses;
        });
        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        $scope.validate = function() {
            $scope.isFirstName = $scope.EditAgentForm.firstName.$error.required;
            $scope.isMobile = $scope.EditAgentForm.mobile.$error.required;
            $scope.isEmail = $scope.EditAgentForm.email.$error.required;
            $scope.isLocation = $scope.EditAgentForm.location.$error.required;
        };
        $scope.addLocation = function(address) {
            var addresses = $global.getAddressObj(address);
            addresses.userId = $scope.data.agentId;
            addresses.userType = 'AGENT';
            addresses.formattedAddress = address.formatted_address;
            authentication.saveCosumerAddress(addresses).then(function(res) {

                // $scope.data.addressId = res.data.address.addressId;
                // growl.success(res.data.message)
                // $uibModalInstance.dismiss('ok');
            })

        };

        function changeAddress() {
            if ($scope.defaultLocation) {
                consumer.setDefaultAdd($scope.defaultLocation).then(function(res) {
                    if (res.status == "SUCCESS") {
                        growl.success(res.data.message);
                    } else if (res.status == "failure") {
                        growl.error(res.error.message)
                    }
                })
            }
        };
        $scope.changeDefualt = function() {
            changeAddress();
        };
        $scope.save = function() {
            $scope.submit = true;
            if ($scope.EditAgentForm.$valid) {

                delete $scope.data.address;
                $scope.data.dataType = "agent"
                consumer.updateProfile($scope.data).then(function(res) {
                    if (res.status == "SUCCESS") {
                        growl.success(res.data.message);
                        $uibModalInstance.dismiss($scope.data);
                    } else if (res.status == "failure") {
                        growl.error(res.error.message)
                    }
                });






            }

        };


    });
