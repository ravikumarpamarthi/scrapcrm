'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:ConsumerEditProfileCtrl
 * @description
 * # ConsumerEditProfileCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('ConsumerEditProfileCtrl', function($window, $timeout, $scope, $global, growl, authentication, $uibModalInstance, consumer, items, NgMap) {
        $scope.items = items;

        $scope.defaultLocation = items.address.addressId;
        $scope.categories = [];
        angular.forEach($scope.items.categories, function(value, key) {
            $scope.categories.push(value.key);
        });

        $scope.vm = {};
        var map;
        $scope.maps = [];
        $scope.$on('mapInitialized', function(evt, evtMap) {
            $scope.maps.push(evtMap);

        });

        function setPlaceObject(latlng) {
            $global.getLocationByLatLng(latlng).then(function(res) {
                $scope.place = res;
                $scope.vm.formattedAddress = res.formatted_address;

                $scope.chosenPlace = res.formatted_address;


            })

        }

        function reRednerMap() {
            $timeout(function() {
                angular.forEach($scope.maps, function(map) {
                    var currCenter = map.getCenter();
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(currCenter);
                });
            }, 500);
        }

        $scope.setCurrentLocation = function() {

            $global.getCurrentLocation().then(function(res) {
                $scope.center = $scope.getLatLng(res);
                var rem = {}
                rem.lat = res.latitude;
                rem.lng = res.longitude;
                //setPlaceObject(rem);
                reRednerMap();
            });

        }

        NgMap.getMap().then(function(evtMap) {
            map = evtMap;
        });
        $scope.setLocations = function() {
            if ($scope.locationadd) {
                $scope.setCurrentLocation();
            }
        };
        $scope.markerDragEnd = function(event) {

            $timeout(function() {
                    var latlng = {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    };
                    setPlaceObject(latlng);
                    $scope.center = $scope.getLatLng(latlng);

                })
                // $scope.chosenPlace = $scope.vm.formattedAddress;
        }

        $scope.getLatLng = function(obj) {

                if (obj && obj.latitude && obj.longitude) {
                    var latLng = [];
                    latLng.push(obj.latitude);
                    latLng.push(obj.longitude);
                    return latLng.join();
                }

            }
            //$scope.setCurrentLocation();

        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            var obj = {};
            obj.lat = $scope.place.geometry.location.lat();
            obj.lng = $scope.place.geometry.location.lng();
            $scope.setLocation(obj);

        }

        $scope.setLocation = function(obj) {

            var center = [];
            center.push(obj.lat);
            center.push(obj.lng);
            $scope.center = center.join();
            $scope.chosenPlace = angular.copy($scope.vm.formattedAddress);
        }



        consumer.userCategories().then(function(res) {
            if (res.status == "SUCCESS") {
                $scope.categoriesList = res.data.categories;
            } else if (res.status == "FAILURE") {
                growl.error(res.error.message)
            }

        });
        consumer.getAddress($scope.items.consumerId).then(function(res) {
            $scope.locations = [];
            $scope.locations = res.data.addresses;
        });
        $scope.addLocation = function(address) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //$scope.addLocation(results[0]);
                    var addresses = $global.getAddressObj(results[0]);


                    addresses.userId = $scope.items.consumerId;

                    addresses.userType = 'CONSUMER';
                    
                    addresses.formattedAddress = ($scope.vm.customadd != '' && $scope.vm.customadd != undefined) ? $scope.vm.customadd + ', ' + $scope.vm.formattedAddress : $scope.vm.formattedAddress;
                    console.log(addresses.formattedAddress);
                    authentication.saveCosumerAddress(addresses).then(function(res) {

                        consumer.getAddress($scope.items.consumerId).then(function(res) {
                            $scope.locations = [];
                            $scope.locations = res.data.addresses;
                        });
                        $scope.locationadd = false;
                        $scope.editForm = true;
                        $scope.deleteaddresses = false;
                        // $scope.data.addressId = res.data.address.addressId;
                        // growl.success(res.data.message)
                        // $uibModalInstance.dismiss('ok');
                    })
                }
            })

        };

        $scope.confirmDelete = function(location) {

            if ($window.confirm("Do you want Delete Address?")) {

                consumer.deleteAddres(location.addressId).then(function(res) {
                    growl.success(res.data.message);

                    consumer.getAddress($scope.items.consumerId).then(function(res) {
                        $scope.locations = [];
                        $scope.locations = res.data.addresses;
                    });

                    $scope.locationadd = false;
                    $scope.editForm = true;
                    $scope.removeaddresses = false;
                    // $uibModalInstance.dismiss('ok');

                    //$scope.deleted=true;
                });

            } else {
                $scope.Message = "You clicked NO.";
            }
        };
        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        $scope.validate = function() {
            $scope.isFirstName = $scope.EditUserForm.firstName.$error.required;
            $scope.isMobile = $scope.EditUserForm.mobile.$error.required;
            $scope.isEmail = $scope.EditUserForm.email.$error.required;
            $scope.isLocation = $scope.EditUserForm.location.$error.required;
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
            $scope.catalog = "Please select any one categories";
            $scope.submit = true;
            if ($scope.EditUserForm.$valid) {
                $scope.items.categories = [];
                angular.forEach($scope.categories, function(value, key) {
                    angular.forEach($scope.categoriesList, function(catvalue, key) {
                        if (value == catvalue.consumerCategoryId)
                            $scope.items.categories.push({
                                key: catvalue.consumerCategoryId,
                                value: catvalue.name
                            })
                    });
                });

                delete $scope.items.address;
                $scope.items.dataType = "consumer";
                consumer.updateProfile($scope.items).then(function(res) {
                    if (res.status == "SUCCESS") {
                        growl.success(res.data.message);
                        $uibModalInstance.dismiss($scope.items);
                    } else if (res.status == "failure") {
                        growl.error(res.error.message)
                    }
                });


            }

        };
    });