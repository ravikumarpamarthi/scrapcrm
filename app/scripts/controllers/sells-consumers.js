    'use strict';

    /**
     * @ngdoc function
     * @name scrapQApp.controller:SellConsumerCtrl
     * @description
     * # SellConsumerCtrl
     * Controller of the scrapQApp
     */
    angular.module('scrapQcrmApp')
        .controller('SellConsumerCtrl', function($scope, products, consumer, $filter, ids, $uibModalInstance, $uibModal, $moment, $timeout, SellNow, $global, growl, $rootScope, NgMap) {
            $scope.data = {
                "consumerId": ids.consumerId,
                "items": []
            };
            var disabledDates = [];
            $scope.popup1 = {};
            $scope.datepickerObject = {};
            $scope.datepickerObjectPopup = {}
            $scope.isOpen = false;
            $scope.chosenPlace = {};
            var noslots = true;
            console.log($scope.data);

            $scope.setdatafunction = function() {
                $scope.data.items = []
                if (ids.confirmationId) {
                    $scope.backButton = true;
                    consumer.getSellById(ids.confirmationId).then(function(res) {
                        var sell = res.data.sell;
                        $scope.data.preferredPaymentMethod = sell.preferredPaymentMethod;
                        $scope.data.items = sell.items;
                        $scope.data.preferredDate = $moment(sell.preferredDate, "DD-MMM-YYYY").toDate(); //sell.preferredDate;
                        $scope.datepickerObjectPopup = {}
                        $scope.datepickerObjectPopup.inputDate = $moment(sell.preferredDate, "DD-MMM-YYYY").toDate();
                        $scope.data.preferredSlot = sell.preferredSlotId;
                        $scope.data.preferredSlotId = sell.preferredSlotId;
                        $scope.data.sellId = sell.sellObjId;
                        $scope.data.type = sell.type;
                        if ($scope.data.type == "DROP") {
                            $scope.selectDrop = true;
                            $scope.pickupat = false;
                            $scope.dropat = true;
                            $scope.reRednerMap();
                        }
                        $scope.data.consumerAddressId = sell.consumerAddress.addressId;
                        SellNow.getAddress(ids.consumerId).then(function(res) {
                            if (res.status == "SUCCESS") {
                                $scope.locations = res.data.addresses;
                                $scope.selectedItem = $filter('filter')(res.data.addresses, { addressId: sell.consumerAddress.addressId })[0];
                                var obj = {};
                                obj.lat = $scope.selectedItem.latitude;
                                obj.lng = $scope.selectedItem.longitude;
                                $scope.setLocation(obj);

                            }

                        });
                        SellNow.getSlots().then(function(res) {
                            $scope.allslots = res.data;
                            var noslots = true;
                            var slots = res.data.presentDaySlots;
                            for (var i = slots.length - 1; i >= 0; i--) {
                                if (slots[i].slotId == $scope.data.preferredSlot) {
                                    slots[i].status = 'Enabled';
                                }
                            }
                            $scope.slots = slots;
                        })

                    });
                } else {
                    $scope.backButton = false;
                    $scope.data.preferredPaymentMethod = "Cash";
                    $scope.datepickerObjectPopup.inputDate = new Date();
                    $global.setSellRequest($scope.categories.users);
                    var sellRequestObj = $global.getSellRequest();

                    for (var i = sellRequestObj.length - 1; i >= 0; i--) {
                        var item = {};
                        item.categoryId = sellRequestObj[i].categoryId;
                        item.categoryName = sellRequestObj[i].name;
                        item.quantity = sellRequestObj[i].qty;
                        item.pricePerUnit = parseFloat(sellRequestObj[i].price);
                        item.image = sellRequestObj[i].image;
                        $scope.data.items.push(item);

                    }
                    SellNow.getSlots().then(function(res) {
                        $scope.allslots = res.data;
                        $scope.slots = res.data.presentDaySlots;
                        for (var i = $scope.slots.length - 1; i >= 0; i--) {
                            if ($scope.slots[i].status != "Disabled") {
                                $scope.data.preferredSlot = $scope.slots[i].slotId;
                                noslots = false;
                            }
                        };
                        if (noslots) {
                            $scope.slots.unshift({
                                slotId: 0,
                                slotName: "Set Next Slot",
                                status: "Enable"
                            });
                            $scope.data.preferredSlot = 0;
                        }
                    })
                }

                SellNow.getAddress(ids.consumerId).then(function(res) {
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
                $scope.consumerTittle = "Sell Request";
            };
            if (!ids.confirmationId) {
                products.getProducts().then(function(res) {
                    if (res.data.categories) {
                        $scope.categories = res.data.categories;
                        $scope.categories.users = [];
                    }
                });
                $scope.consumerTittle = "Consumer Categories";

            } else {
                $scope.dataset_first = true;
                $scope.dataset_second = true;
                $scope.dataset_last = false;
                // $scope.consumerTittle = "Sell Request";
                $scope.setdatafunction();

            }


            $scope.status = {
                opened: false
            };
            $scope.changeslots = function() {

                var today = $moment().format('DD-MMM-YYYY')
                var current = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY')
                if (today != current) {
                    $scope.slots = $scope.allslots.allSlots;
                    $scope.data.preferredSlot = $scope.slots[0].slotId;
                } else {
                    if ($scope.allslots) {
                        $scope.slots = $scope.allslots.presentDaySlots;
                    }
                }
            };
            var maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            $scope.dateOptions = {
                maxDate: maxDate,
                minDate: new Date(),
                startingDay: 1
            };
            $scope.dateOptionsPick = {
                maxDate: maxDate,
                minDate: new Date(),
                startingDay: 1
            };
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
            $scope.decreaseQty = function(index) {
                if ($scope.categories[index].qty > 1)
                    $scope.categories[index].qty = parseInt($scope.categories[index].qty) - 1;
            };
            $scope.increaseQty = function(index) {
                $scope.categories[index].qty = parseInt($scope.categories[index].qty) + 1;
            }
            $scope.placesellRequest = function() {
                if ($rootScope.apiToken) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/place-sell-request.html',
                        controller: 'PlaceSellRequestCtrl',
                        size: 'lg',
                        resolve: {
                            items: function() {
                                return $scope.categories.users;
                            }
                        }
                    });
                }
            };



            $scope.setCurrentLocation = function() {
                //alert('sfdsdfsdfsd');
            };
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
            $scope.disableTap = function(drop) {
                var container = document.getElementsByClassName('pac-container');
                angular.element(container).attr('data-tap-disabled', 'true');
                angular.element(container).on("click", function() {
                    if (drop) {
                        document.getElementById('dropautocomplete').blur();
                    } else
                        document.getElementById('autocomplete').blur();
                });
            }
            $timeout(function() {}, $global.defaultTimeout);
            $scope.data.preferredDate = $moment().format('DD-MMM-YYYY');
            $scope.drop = {};

            function getAgents(obj) {
                SellNow.getAgents(obj.lat, obj.lng).then(function(res) {
                    if (res.status == "SUCCESS") {
                        $scope.agents = res.data.addresses;
                        // console.log($scope.agents);
                    }
                })
            }
            $scope.placeChanged = function(drop) {
                $scope.place = this.getPlace();
                var obj = {};
                obj.lat = $scope.place.geometry.location.lat();
                obj.lng = $scope.place.geometry.location.lng();
                getAgents(obj);
                $scope.setLocation(obj);
            }
            $scope.dropPlaceChanged = function() {
                $scope.place = this.getPlace();
                var obj = {};
                obj.lat = $scope.place.geometry.location.lat();
                obj.lng = $scope.place.geometry.location.lng();
                getAgents(obj);
                $scope.setLocation(obj);

            }
            $scope.getLatLng = function(obj) {

                if (obj && obj.latitude) {
                    var latLng = [];
                    latLng.push(obj.latitude);
                    latLng.push(obj.longitude);
                    //console.log(map.directionsRenderers)
                    return latLng.join();
                }

            }
            $scope.setAgent = function() {
                $scope.drop.agentId = this.data
                $scope.data.agentId = this.data.userId;
            }
            $scope.setDropAgent = function(userId) {
                for (var i = $scope.agents.length - 1; i >= 0; i--) {
                    if ($scope.agents[i].userId == userId) {
                        $scope.drop.agentId = $scope.agents[i];
                        break;
                    }
                };

            }
            $scope.sellNow = function(drop) {

                if (ids.confirmationId) {
                    $scope.data.sellSubType = 'NOW';

                    if (!$scope.place && !$scope.data.consumerAddressId) {
                        return;
                    }
                    if (drop == 'DROP') {
                        if (!$scope.drop.agentId || $scope.drop.agentId.userId == null) {
                            return;
                        }
                        $scope.data.agentId = $scope.drop.agentId.userId;
                        $scope.data.agentAddressId = $scope.drop.agentId.addressId;
                    }
                    $scope.data.preferredDate = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY');
                    if (drop == "PICKUP") {
                        if ($scope.place) {
                            var SELLTYPE = "PICKUP"
                            var address = $global.getAddressObj($scope.place);
                            address.userId = ids.consumerId;
                            address.userType = "CONSUMER";
                            address.formattedAddress = ($scope.vm.customadd != '' && $scope.vm.customadd != undefined) ? $scope.vm.customadd + ', ' + $scope.vm.formattedAddress : $scope.vm.formattedAddress;
                            SellNow.saveCosumerAddress(address).then(function(res) {
                                $scope.data.consumerAddressId = res.data.address.addressId;
                                SellNow.updatePickup($scope.data, SELLTYPE).then(function(response) {
                                    if (response.status = "SUCCESS") {
                                        growl.success(response.data.message);
                                        $uibModalInstance.dismiss('cancel');
                                    } else if (res.status == "FAILURE") {
                                        growl.error(response.error.errors[0].message);
                                    }
                                })
                            })
                        } else {
                            var SELLTYPE = "PICKUP"
                            SellNow.updatePickup($scope.data, SELLTYPE).then(function(res) {
                                if (res.status == "SUCCESS") {
                                    growl.success(res.data.message);
                                    $uibModalInstance.dismiss('cancel');
                                } else if (res.status == "FAILURE") {
                                    growl.error(res.error.errors[0].message);
                                }
                            })
                        }
                    } else {
                        if ($scope.place) {
                            var SELLTYPE = "DROP"
                            var address = $global.getAddressObj($scope.place);
                            address.userId = ids.consumerId;
                            address.userType = "CONSUMER";
                            address.formattedAddress = ($scope.vm.customadd != '' && $scope.vm.customadd != undefined) ? $scope.vm.customadd + ', ' + $scope.vm.formattedAddress : $scope.vm.formattedAddress;
                            SellNow.saveCosumerAddress(address).then(function(res) {
                                $scope.data.consumerAddressId = res.data.address.addressId;
                                SellNow.updateDrop($scope.data, SELLTYPE).then(function(response) {
                                    if (res.status == "SUCCESS") {
                                    growl.success(res.data.message);
                                    $uibModalInstance.dismiss('cancel');
                                } else if (res.status == "FAILURE") {
                                    growl.error(res.error.message);
                                }
                                })
                            })
                        } else {
                            var SELLTYPE = "DROP"
                            SellNow.updateDrop($scope.data, SELLTYPE).then(function(res) {
                                if (res.status == "SUCCESS") {
                                    growl.success(res.data.message);
                                    $uibModalInstance.close('cancel');

                                }else if (res.status == "FAILURE") {
                                    growl.error(res.error.message);

                                }
                            })
                        }
                    }
                } else {
                    var today = $moment().format('DD-MMM-YYYY')
                    var current = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY')
                    if (current == today) {
                        $scope.data.sellSubType = 'NOW';

                    } else {
                        $scope.data.sellSubType = 'APPOINTMENT';
                    }


                    if (!$scope.place && !$scope.data.consumerAddressId) {
                        return;
                    }
                    if (drop == 'DROP') {
                        if (!$scope.drop.agentId || $scope.drop.agentId.userId == null) {
                            return;
                        }
                        $scope.data.agentId = $scope.drop.agentId.userId;
                        $scope.data.agentAddressId = $scope.drop.agentId.addressId;
                    }
                    $scope.data.preferredDate = $moment($scope.datepickerObjectPopup.inputDate).format('DD-MMM-YYYY');
                    if ($scope.place) {
                        var address = $global.getAddressObj($scope.place);
                        address.userId = ids.consumerId;
                        address.userType = "CONSUMER";
                        address.formattedAddress = ($scope.vm.customadd != '' && $scope.vm.customadd != undefined) ? $scope.vm.customadd + ', ' + $scope.vm.formattedAddress : $scope.vm.formattedAddress;
                        SellNow.saveCosumerAddress(address).then(function(res) {
                            $scope.data.consumerAddressId = res.data.address.addressId;
                            SellNow.sellNow($scope.data, drop).then(function(response) {
                                growl.success(response.data.message);
                                $scope.consumerTittle = "Confirmation";
                                consumer.getSellById(response.data.confirmationId).then(function(res) {
                                    if (res.status == "SUCCESS") {
                                        $scope.items = res.data.sell;
                                        $scope.dataset_second = false;
                                        $scope.dataset_last = true;
                                    }
                                });
                            })
                        })
                    } else {
                        SellNow.sellNow($scope.data, drop).then(function(res) {
                            if (res.status == "SUCCESS") {
                                growl.success(res.data.message);
                                $scope.consumerTittle = "Confirm";
                                consumer.getSellById(res.data.confirmationId).then(function(res) {
                                    if (res.status == "SUCCESS") {
                                        $scope.items = res.data.sell;
                                        $scope.dataset_second = false;
                                        $scope.dataset_last = true;
                                    }
                                });

                            }else if (res.status == "FAILURE") {                                
                                growl.error(res.error.message);
                            }
                             
                        })
                    }
                }
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
                } else {
                    $scope.data.consumerAddressId = null;
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
            $scope.cancel = function() {
                $uibModalInstance.close('cancel');
            };
            $scope.setDataFill = function() {
                $scope.dataset_first = false;
                $scope.dataset_second = false;
                $scope.dataset_last = false;
                $scope.consumerTittle = "Consumer Categories"

            }
        });
