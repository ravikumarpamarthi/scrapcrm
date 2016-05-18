'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('AddBidCtrl', function($scope, products, BidService, consumer, ids, $uibModalInstance, $uibModal, $moment, $timeout, SellNow, $global, growl, $rootScope, NgMap) {
       $scope.consumerTittle="Consumer Categories";
        products.getProducts().then(function(res) {
            if (res.data.categories) {
                $scope.categories = res.data.categories;
                $scope.categories.users = [];
            }
        });
        $scope.data = {
            "consumerId": ids,
            "items": []
        };
         $scope.decreaseQty = function(index) {
                if ($scope.categories[index].qty > 1)
                    $scope.categories[index].qty = parseInt($scope.categories[index].qty) - 1;
            };
            $scope.increaseQty = function(index) {
                $scope.categories[index].qty = parseInt($scope.categories[index].qty) + 1;
            }
        $scope.setdatanext = function() {
            $global.setSellRequest($scope.categories.users);
            //sellRequestObj=[];
            $scope.consumerTittle="Bids Request";
            if ($scope.categories.users.length > 0) {
                $scope.bid_first = true;
                $scope.bid_second = true;
                $scope.data.items = []
                var sellRequestObj = $global.getSellRequest();
                for (var i = sellRequestObj.length - 1; i >= 0; i--) {
                    var item = {};
                    item.categoryId = sellRequestObj[i].categoryId;
                    item.categoryName = sellRequestObj[i].name;
                    item.quantity = sellRequestObj[i].qty;
                    item.image = sellRequestObj[i].image;
                    item.bidPrice = parseFloat(sellRequestObj[i].price);
                    $scope.data.items.push(item);
                };
                SellNow.getAddress(ids).then(function(res) {
                    $scope.locations = res.data.addresses;
                    if ($scope.locations[0] && $scope.locations[0].defaultAddress == 'YES') {
                        $scope.selectedItem = $scope.locations[0];
                        $scope.setMap($scope.selectedItem, 'drop');
                        $scope.reRednerMap();
                    } else {
                        $scope.locations = res.data.addresses;
                        if ($scope.locations.length > 0) {
                            $scope.selectedItem = $scope.locations[0];
                            $scope.setMap($scope.selectedItem, 'drop');
                            $scope.reRednerMap();
                        } else {
                            $global.getCurrentLocation().then(function(res) {
                                $scope.center = $scope.getLatLng(res);
                            });

                        }
                    }
                    $scope.reRednerMap();

                });
            } else {
                growl.error("Please select any one categories");
            }
        }
        $scope.BiddecreaseQty = function(index) {
            if ($scope.data.items[index].quantity > 1) {
                $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) - 1;
            }
        }
        $scope.BidincreaseQty = function(index) {
            $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) + 1;
        }
        $scope.decreasePrice = function(index) {
            if ($scope.data.items[index].bidPrice > 1) {

                $scope.data.items[index].bidPrice = parseInt($scope.data.items[index].bidPrice) - 1;
            }
        }
        $scope.increasePrice = function(index) {
            $scope.data.items[index].bidPrice = parseInt($scope.data.items[index].bidPrice) + 1;
        }
        var map;
        NgMap.getMap().then(function(evtMap) {
            map = evtMap;
        });
        $scope.maps = [];
        $scope.$on('mapInitialized', function(evt, evtMap) {
            $scope.maps.push(evtMap);
        });
        $scope.reRednerMap = function() {
            $timeout(function() {
                angular.forEach($scope.maps, function(map) {
                    // google.maps.setCenter($scope.center);
                    var currCenter = map.getCenter();
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(currCenter);
                });
            }, 500);
        }
        var geocoder = new google.maps.Geocoder;
        $scope.vm = {};

        $scope.chosenPlace = {};
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.setMap = function(location) {
            if (location) {
                var obj = {};
                $scope.data.addressId = location.addressId;
                obj.lat = location.latitude;
                obj.lng = location.longitude;
                $scope.setLocation(obj);
            } else {
                $scope.data.addressId = null;
            }
        }

        $scope.setLocation = function(obj) {
            var center = [];
            center.push(obj.lat);
            center.push(obj.lng);
            $scope.center = center.join();
        }

        function setPlaceObject(latlng) {
            $global.getLocationByLatLng(latlng).then(function(res) {
                $scope.place = res;
                $scope.vm.formattedAddress = res.formatted_address;

            })
        }
        $scope.setCurrentLocation = function() {
            $global.getCurrentLocation().then(function(latlng) {
                $scope.center = latlng.lat + "," + latlng.lng;
                $scope.reRednerMap();
                setPlaceObject(latlng)
            })
        }

        $scope.placeChanged = function(drop) {
            $scope.place = this.getPlace();
            var obj = {};
            obj.lat = $scope.place.geometry.location.lat();
            obj.lng = $scope.place.geometry.location.lng();
            //getAgents(obj);
            $scope.setLocation(obj);
        }

        $scope.markerDragEnd = function(event) {
            $timeout(function() {
                var latlng = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                setPlaceObject(latlng);
                $scope.center = latlng.lat + "," + latlng.lng;
            })
        }

        $scope.placeBid = function(drop) {
            if (!$scope.place && !$scope.data.addressId) {
                $scope.placeError = true;
            } else {

                if ($scope.place) {
                    var address = $global.getAddressObj($scope.place);
                    address.userId = ids;
                    address.userType = "CONSUMER";
                    address.formattedAddress = $scope.vm.formattedAddress;
                    SellNow.saveCosumerAddress(address).then(function(res) {
                        $scope.data.addressId = res.data.address.addressId;
                        BidService.placeBid($scope.data, drop).then(function(res) {
                            if (res.status == "SUCCESS") {
                                growl.success(res.data.message);
                                BidService.getBidById(res.data.confirmationId).then(function(res) {
                                    $scope.items = res.data.bid;
                                    $scope.bid_second = false;
                                    $scope.bid_last = true;
                                    $scope.consumerTittle="Confirm";
                                });
                            } else if (res.status == $global.FAILURE) {

                                $scope.errorMessage = res.error.message;
                            }

                        })
                    })
                } else {
                    BidService.placeBid($scope.data, drop).then(function(res) {
                        if (res.status == "SUCCESS") {
                            growl.success(res.data.message);
                            BidService.getBidById(res.data.confirmationId).then(function(res) {
                                $scope.items = res.data.bid;
                                $scope.bid_second = false;
                                $scope.bid_last = true;
                                $scope.consumerTittle="Confirm";
                            });
                        } else if (res.status == $global.FAILURE) {

                            $scope.errorMessage = res.error.message;
                        }

                    })
                }
            }

        }
        $scope.backmodal=function(){
        	$scope.bid_first=false;
        	$scope.bid_second=false; 
        	$scope.consumerTittle = "Consumer Categories";
        }
        $scope.ok = function() {
            $uibModalInstance.dismiss('ok');
        };
    });
