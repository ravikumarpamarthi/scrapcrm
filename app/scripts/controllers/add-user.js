'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AddUserCtrl
 * @description
 * # AddUserCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('AddUserCtrl', function($scope, authentication, consumer, $moment, items, $global, growl, $uibModalInstance, $state, $timeout, NgMap) {
        //$scope.data = {}
        $scope.setHeader = items;
        //$scope.dataset='root.'+$stateParams.id;
        //console.log($stateParams.id);
        //$scope.mytime = new Date();
        /*
          $scope.hstep = 1;
          $scope.mstep = 15;

          $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
          };*/
        $scope.vm = {};

        if ($scope.setHeader == "CONSUMER") {
            $scope.categories = [];
            consumer.userCategories().then(function(res) {
                if (res.status == "SUCCESS") {
                    $scope.categoriesList = res.data.categories;
                } else if (res.status == "FAILURE") {
                    growl.error(res.error.message)
                }

            })
        }
        /*   profile.updateProfile($scope.data).then(function(res) {
                  if (res.status == "SUCCESS") {
                      growl.success(res.data.message);
                  } else if (res.status == "failure") {
                      growl.error(res.error.message)
                  }
              });
          }*/



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

        /*  $scope.addLocation = function() {
              if (!$scope.place || !$scope.chosenPlace) {
                  $scope.errorMessage = true;
                  return;
              }
              var address = $global.getAddressObj($scope.place);
              console.log(address);
              address.userId = $global.consumerId;
              address.userType = "CONSUMER";
              address.formattedAddress = $scope.chosenPlace;
              profile.saveCosumerAddress(address).then(function(res) {

                  $scope.data.addressId = res.data.address.addressId;
                  growl.success(res.data.message)
                  $uibModalInstance.dismiss('ok');
              })

          };*/
        $scope.vm = {};
        var map;
        $scope.maps = [];
        $scope.$on('mapInitialized', function(evt, evtMap) {
            $scope.maps.push(evtMap);

        });


        NgMap.getMap().then(function(evtMap) {
            map = evtMap;
        });
        $scope.setLocations = function() {
            if ($scope.locationadd) {
               
            }
        };
         $scope.setCurrentLocation();
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
        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        $scope.addUsers = function(address) {
            $scope.catalog = "Please select any one categories";
            $scope.submitted = true;
            if ($scope.addUserForm.$valid) {
                $scope.data.registerType = "CRM";
                $scope.data.userType = $scope.setHeader, //"SQAGENT"
                    $global.setLocalItem("registration", $scope.authorization, true);
                authentication.register($scope.data).then(function(res) {
                    
                    if (res.status == "SUCCESS") {
                        $scope.userid = res.data.userId;
                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({ 'address': address }, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                $scope.addLocation(results[0]);
                                if ($scope.data.userType == "CONSUMER") {
                                    $scope.data.categories = [];
                                    growl.success(res.data.message);
                                    angular.forEach($scope.categories, function(value, key) {
                                        angular.forEach($scope.categoriesList, function(catvalue, key) {
                                            if (value == catvalue.consumerCategoryId)
                                                $scope.data.categories.push({
                                                    key: catvalue.consumerCategoryId,
                                                    value: catvalue.name
                                                })
                                        });
                                    });

                                    //$ionicLoading.hide();
                                    delete $scope.data.registerType;
                                    delete $scope.data.userType;
                                    $scope.data.consumerId = res.data.userId;
                                    $scope.data.preferredPaymentMode = "";
                                    $scope.data.profileImage = "";
                                    $scope.data.walletBalance = "";
                                    $scope.data.dataType = "consumer";
                                    consumer.updateProfile($scope.data).then(function(res) {
                                        if (res.status == "SUCCESS") {
                                            // growl.success(res.data.message);
                                        } else if (res.status == "failure") {
                                            growl.error(res.error.message)
                                        }
                                    });
                                }
                                $uibModalInstance.close('cancel');
                            } else if (res.status == "FAILURE") {
                                //$ionicLoading.hide();
                                 growl.error(res.error.message)

                            }

                        });

                    } else {
                         growl.error(res.error.message);
                    }
                });

            }
            // console.log($scope.mytime)
            //$scope.mytime=$moment().format('H:mm:ss');
            //console.log($scope.mytime)
        };

        $scope.addLocation = function(address) {

            var addresses = $global.getAddressObj(address);

            addresses.userId = $scope.userid;
            addresses.userType = $scope.data.userType;
            addresses.formattedAddress = ($scope.vm.customadd != '' && $scope.vm.customadd != undefined) ? $scope.vm.customadd + ', ' + $scope.vm.formattedAddress : $scope.vm.formattedAddress;
            //addresses.formattedAddress = address.formatted_address;
            authentication.saveCosumerAddress(addresses).then(function(res) {

                // $scope.data.addressId = res.data.address.addressId;
                // growl.success(res.data.message)
                // $uibModalInstance.dismiss('ok');
            })

        };
    });
