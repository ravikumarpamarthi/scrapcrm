'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:ComplaintsCtrl
 * @description
 * # ComplaintsCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('PostComplaintsCtrl', function($scope, $global, $uibModalInstance, items, authentication, growl,consumer) {
        authentication.complaintCategories().then(function(res) {
            if (res.status == "SUCCESS") {
                //console.log(res.data.categoryList)
                $scope.categories = res.data.categories;

            }
        });
        $scope.consumerId=items;
        $scope.postComplaints=function(key){
         consumer.getConsumer(key).then(function(res) {
            if(res.status=="SUCCESS")
            {
                $scope.name=res.data.name;
                $scope.id=res.data.userId;
            }
            else{
                 $scope.nodata=res.error.message;
            }
         });
        }
        $scope.items = items;
        $scope.ok = function(data) {
            $uibModalInstance.close(data);
        };
       
        $scope.changeCategories = function(id) {
            if (id) {
                authentication.complaintsType(id).then(function(res) {
                    if (res.status && res.status == "SUCCESS") {
                        $scope.compaintType = res.data.types;

                    } else {
                        growl.error("Complaint error");
                    }
                });
            }
        };
        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        $scope.validate = function() {
            $scope.isCategory = $scope.complaintForm.complaintCategory.$error.required;
            /*$scope.isType = $scope.complaintForm.complaintType.$error.required;
            $scope.isLocation = $scope.complaintForm.complaintLocation.$error.required;*/
            $scope.isDescription = $scope.complaintForm.complaintDescription.$error.required;
        };
        //$scope.category = $scope.categories[0];
        $scope.save = function() {
            $scope.submit = true;
            if ($scope.complaintForm.$valid) {
                // $scope.data.address = $scope.getAddressObj(chosenPlaceObj);
                $scope.data.consumerId =$scope.consumerId;
                $scope.data.category = $("#source option:selected").text();
                authentication.complaintsSave($scope.data).then(function(res) {
                    if (res.status && res.status == "SUCCESS") {
                        growl.success(res.data.message);
                        $uibModalInstance.dismiss(res);
                    } else {
                        growl.error("Complaint error");
                    }
                });

            }

        };
        $scope.getAddressObj = function(geolocation) {
            var address = {};
            var geometry = geolocation.geometry;
            address.latitude = geometry.location.lat();
            address.longitude = geometry.location.lng();
            address.addressId = "1";
            address.type = "Business";

            for (var i = geolocation.address_components.length - 1; i >= 0; i--) {
                if (geolocation.address_components[i].types[0] == "locality") {
                    address.city = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[1] == "sublocality") {
                    address.locality = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "administrative_area_level_1") {
                    address.state = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "country") {
                    address.country = geolocation.address_components[i].long_name;
                }
                if (geolocation.address_components[i].types[0] == "postal_code") {
                    address.postalCode = geolocation.address_components[i].long_name;
                }
            };

            return address;
        }
    });
