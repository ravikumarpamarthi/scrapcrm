'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('AddConsumerCtrl', function($scope, products, BidService, consumer, ids, $uibModalInstance, $uibModal, $moment, $timeout, SellNow, $global, growl, $rootScope, NgMap) {
       $scope.consumerTittle="Consumer Categories";
        products.getProducts().then(function(res) {
            if (res.data.categories) {
                $scope.categories = res.data.categories;
                $scope.categories.users = [];

            }

        });
         $scope.decreaseQty = function(index) {
                if ($scope.categories[index].qty > 1)
                    $scope.categories[index].qty = parseInt($scope.categories[index].qty) - 1;
            };
            $scope.increaseQty = function(index) {
                $scope.categories[index].qty = parseInt($scope.categories[index].qty) + 1;
            }
        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };
        var disabledDates = [];
        //$global.setSellRequest($scope.categories.users);
        $scope.popup1 = {};
        $scope.datepickerObject = {};
        $scope.datepickerObjectPopup = {}
        $scope.datepickerObjectPopup.inputDate = new Date();
        $scope.isOpen = false;
        $scope.status = {
            opened: false
        };
        $scope.minDate = $scope.minDate ? null : new Date();
        $scope.open = function($event) {
            $scope.status.opened = true;
        };
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();
        var datePickerCallbackPopup = function(val) {
            if (typeof(val) === 'undefined') {} else {
                $scope.datepickerObjectPopup.inputDate = val;
            }
        };
        /*date picker end */
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
                    var currCenter = map.getCenter();
                    google.maps.event.trigger(map, 'resize');
                    map.setCenter(currCenter);
                });
            }, 500);
        }
        $scope.setdatanext = function() {
        	$scope.consumerTittle="Appointments Request";
            $global.setSellRequest($scope.categories.users);
            //sellRequestObj=[];
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
        }
        var geocoder = new google.maps.Geocoder;
        $scope.vm = {};
        $scope.disableTap = function() {
            var container = document.getElementsByClassName('pac-container');
            angular.element(container).attr('data-tap-disabled', 'true');
            angular.element(container).on("click", function() {
                document.getElementById('autocomplete').blur();
            });
        }

        var sellRequestObj = $global.getSellRequest();
        if (!sellRequestObj) {
            //$state.go("main.dashboard");
            return;
        };
         SellNow.getSlots().then(function(res) {
         	 $scope.allslots=res.data;
                 $scope.slots = res.data.presentDaySlots;
            for (var i = $scope.slots.length - 1; i >= 0; i--) {
                 if($scope.slots[i].status!="Disabled"){
                    $scope.data.preferredSlot = $scope.slots[i].slotId;
                    break;
                 }
            };
            })
         $scope.changeslots=function(){
         	/* if (typeof(val) === 'undefined') {} else {
                $scope.datepickerObjectPopup.inputDate = val;
                var today=$moment().format('DD-MMM-YYYY')
                var current=$moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY')
                if(today!=current){
                    $scope.slots=$scope.allslots.allSlots;
                    $scope.data.preferredSlot = $scope.slots[0].slotId;
                }else{
                    if($scope.allslots)
                    $scope.slots=$scope.allslots.presentDaySlots;
                }
            }*/
         	/*SellNow.getSlots().then(function(res) {
                 $scope.slots = res.data.presentDaySlots;
            for (var i = $scope.slots.length - 1; i >= 0; i--) {
                 if($scope.slots[i].status!="Disabled"){
                    $scope.data.preferredSlot = $scope.slots[i].slotId;
                    break;
                 }
            };
            });*/
         	var today=$moment().format('DD-MMM-YYYY')
                var current=$moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY')
                if(today!=current){
                    $scope.slots=$scope.allslots.allSlots;
                    $scope.data.preferredSlot = $scope.slots[0].slotId;
                }else{
                    if($scope.allslots)
                    $scope.slots=$scope.allslots.presentDaySlots;
                }
         }
           

        $scope.data = {
            "consumerId": $global.consumerId,
            "items": []
        };

        for (var i = sellRequestObj.length - 1; i >= 0; i--) {
            var item = {};
            if (sellRequestObj[i] && sellRequestObj.length > 0) {
                item.categoryId = sellRequestObj[i].categoryId;
                item.categoryName = sellRequestObj[i].name;
                item.quantity = sellRequestObj[i].qty;
                item.bidPrice = parseFloat(sellRequestObj[i].price);
                $scope.data.items.push(item);
            }
        };
        $scope.placeChanged = function() {
            $scope.place = this.getPlace();
            var obj = {};
            obj.lat = $scope.place.geometry.location.lat();
            obj.lng = $scope.place.geometry.location.lng();
            $scope.setLocation(obj);
            // $scope.placeError=false;

        }
        $scope.sellNow = function(drop) {
            $scope.data.sellSubType = 'APPOINTMENT';
            if (!$scope.place && !$scope.data.consumerAddressId) {

                $scope.placeError = true;
            } else {

                if (drop == 'DROP') {
                    $scope.data.agentId = $scope.drop.agentId.userId;
                    $scope.data.agentAddressId = $scope.drop.agentId.addressId;
                }
                $scope.data.consumerId = ids;
                $scope.data.preferredDate = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY');
                if ($scope.place) {
                    var address = $global.getAddressObj($scope.place);
                    address.userId = ids;
                    address.userType = "CONSUMER";
                    address.formattedAddress = $scope.vm.formattedAddress;
                    SellNow.saveCosumerAddress(address).then(function(res) {
                        $scope.data.consumerAddressId = res.data.address.addressId;
                        SellNow.sellNow($scope.data, drop).then(function(res) {
                            if (res.status == "SUCCESS") {
                                growl.success(res.data.message);
                                consumer.getSellById(res.data.confirmationId).then(function(res) {
                                    if (res.status == "SUCCESS") {
                                        $scope.items = res.data.sell;
                                        $scope.consumerTittle="Confirm";
                                        $scope.app_book = false;
                                        $scope.app_last = true;
                                    }
                                });
                            } else if (res.status == $global.FAILURE) {

                                $scope.errorMessage = res.error.message;
                            }
                        })
                    })
                } else {
                    SellNow.sellNow($scope.data, drop).then(function(res) {
                        if (res.status == "SUCCESS") {
                            growl.success(res.data.message);
                            $scope.consumerTittle="Confirm";
                            consumer.getSellById(res.data.confirmationId).then(function(res) {
                                $scope.items = res.data.sell;
                                $scope.app_book = false;
                                $scope.app_last = true;
                            });

                        } else if (res.status == $global.FAILURE) {

                            $scope.errorMessage = res.error.message;
                        }
                    })
                }
            }

        }
        $scope.drop = {};

        function getAgents(obj) {
            $scope.drop.agentId = {};
            SellNow.getAgents(obj.lat, obj.lng).then(function(res) {
                $scope.agents = res.data.addresses;
            })
        }
        $scope.setMap = function(location, drop) {

            if (location) {
                var obj = {};
                $scope.data.consumerAddressId = location.addressId;
                obj.lat = location.latitude;
                obj.lng = location.longitude;
                if (drop) {
                    getAgents(obj);
                }
                $scope.setLocation(obj);
                $scope.placeError = false;
            } else {
                $scope.placeError = true;
                $scope.data.consumerAddressId = null;
            }
        }
        $scope.setLocation = function(obj) {
            var center = [];
            center.push(obj.lat);
            center.push(obj.lng);
            $scope.center = center.join();
            $scope.positions = [{
                pos: center
            }];
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

        $scope.ok = function() {
            $uibModalInstance.dismiss('ok');
        };
        $scope.backbutton=function(){
        	$scope.app_cat=false;
        	$scope.app_book=false;
        	$scope.consumerTittle="Consumer Categories";
        }

    });
