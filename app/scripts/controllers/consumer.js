'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:ConsumersCtrl
 * @description
 * # ConsumersCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('ConsumerCtrl', function($scope, $http, $state, dashboard, $uibModal, $log, consumer, growl, BidService) {
        $scope.pages = 0;
        /*      $scope.getLocation = function(val) {
            return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
              params: {
                address: val,
                sensor: false
              }
            }).then(function(response){
              return response.data.results.map(function(item){
                return item.formatted_address;
              });
            });
          };*/
        $scope.searchConsumer = function(key) {
            var type = 'CONSUMER';
            $scope.submitted = true;
            $scope.transactionStatus = "pending";
            if (!$scope.form.$valid) {
                return false;
            } else {
                $scope.noConsumerFound = false;
                consumer.getConsumer(type, key).then(function(res) {
                    if (res.status == "SUCCESS") { // && res.data.userType == "CONSUMER"
                        // if (res.data.userId) {
                        $scope.consumers = res.data;
                        if (res.data.users.length == 1) {
                            $scope.length0 = true;
                            $scope.consumerDetails(0);
                        } else {
                            $scope.consumer_list = res.data.users;
                            $scope.length0 = false;
                            $scope.consumerId = false;
                        }
                        if (res.data.message == "No records found") {
                            $scope.noConsumerFound = true;
                        }
                        // $scope.consumerId = res.data.userId;
                        // var params = {
                        //     "consumerid": $scope.consumerId,
                        //     "size": 30,
                        //     "page": $scope.pages,
                        //     "status": "pending"
                        // };

                        // getConsumerProfile($scope.consumerId);
                        // consumer.refferalCode($scope.consumerId).then(function(res) {
                        //     $scope.refferedCodes = res.data.users;
                        // });

                        // getConsumerAppointments(params);
                        // var complaintParams = {
                        //     "consumerid": $scope.consumerId,
                        //     "size": 10,
                        //     "page": 1,

                        // };
                        // $scope.getComplaints(complaintParams);
                        /*    consumer.getPendingFeedBacks($scope.consumerId).then(function(res) {
                                if (res.status == "SUCCESS") {
                                    if (res.data.feedbacks.length > 0)
                                        $scope.profileEdit = res.data.feedbacks;
                                } else {
                                    $scope.noConsumerFound = "No feedbacks record found";
                                }


                            }, function(err) {

                            })*/

                        // }
                    } else if (res.status == "FAILURE") {
                        $scope.noConsumerFound = true;
                    } else {
                        $scope.noConsumerFound = true;
                    }

                }, function(err) {

                })
            }

        };

        $scope.loadConsumer = function() {
            var type = 'CONSUMER';
            $scope.submitted = true;
            $scope.transactionStatus = "pending";
            $scope.noConsumerFound = false;
            consumer.usersLoad(type).then(function(res) {
                if (res.status == "SUCCESS") {
                    $scope.consumers = res.data;
                    if (res.data.users.length == 1) {
                        $scope.length0 = true;
                        $scope.consumerDetails(0);
                    } else {
                        $scope.consumer_list = res.data.users;
                        $scope.length0 = false;
                        $scope.consumerId = false;
                    }
                    if (res.data.message == "No records found") {
                        $scope.noConsumerFound = true;
                    }
                } else if (res.status == "FAILURE") {
                    $scope.noConsumerFound = true;
                } else {
                    $scope.noConsumerFound = true;
                }

            }, function(err) {

            })
        }
        $scope.loadConsumer();

        $scope.consumerDetails = function(val) {
            $scope.length0 = true;
            var details = $scope.consumers.users[val];
            $scope.consumerId = details.userId;
            var params = {
                "consumerid": $scope.consumerId,
                "size": 30,
                "page": $scope.pages,
                "status": "pending"
            };

            getConsumerProfile($scope.consumerId);
            $scope.consumer_list = false;
            consumer.refferalCode($scope.consumerId).then(function(res) {
                $scope.refferedCodes = res.data.users;
            });

            getConsumerAppointments(params);
            var complaintParams = {
                "consumerid": $scope.consumerId,
                "size": 10,
                "page": 1,

            };
            $scope.getComplaints(complaintParams);
        }
        $scope.showComplaintsDetails = function(view) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/complaints-view-modal.html',
                controller: 'ComplaintViewCtrl',
                size: "md",
                backdrop: 'static',
                resolve: {
                    items: function() {
                        return view;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.transactionChange = function(status) {
            var params = {
                "consumerid": $scope.consumerId,
                "size": 30,
                "page": $scope.pages,
                "status": status
            };
            getConsumerAppointments(params);
        };

        $scope.addConsumers = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/add-user.html',
                controller: 'AddUserCtrl',
                size: "lg",
                backdrop: 'static',
                resolve: {
                    items: function() {
                        return 'CONSUMER';
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

        $scope.getComplaints = function(params) {
            dashboard.complaints(params).then(function(res) {
                if (res.status == "SUCCESS") {
                    $scope.todayAppointment = res.data.complaints;
                }
            })
        };
        $scope.addComplaints = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/postcomplaints.html',
                controller: 'PostComplaintsCtrl',
                size: 'lg',
                resolve: {
                    items: function() {
                        return $scope.consumerId;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                var complaintParams = {
                    "consumerid": $scope.consumerId,
                    "size": 10,
                    "page": 1,

                };
                $scope.getComplaints(complaintParams);
            });
        };

        function getConsumerProfile(consumerId) {
            consumer.getProfile(consumerId).then(function(res) {
                if (res.status == "SUCCESS") {
                    $scope.profileEdit = res.data.consumer;
                    $scope.profileEdit.rating = parseInt($scope.profileEdit.rating);
                } else if (res.status == "FAILURE") {
                    $scope.noConsumerFound = "No consumer record found";
                }

            }, function(err) {
                console.log(err);
            })
        }
        $scope.pickupsApp = [];
        $scope.pickupsEdit = [];

        function getConsumerAppointments(params) {
            consumer.getSellRquests(params).then(function(res) {
                //console.log(res);
                if (res.status == 'SUCCESS') {

                    $scope.pickupsEdit = res.data.sells;
                }
            }, function(err) {
                //$ionicLoading.hide();
            })
        }
        $scope.viewMore = function() {
            $scope.pages += 1;
            var params = {
                "consumerid": $scope.consumerId,
                "size": 10,
                "page": $scope.pages,
                "status": "pending"
            };
            getConsumerAppointments(params);

        };

        function getConsumerBids(params) {
            BidService.getBids(params).then(function(res) {
                if (res.status == 'SUCCESS') {

                    $scope.BidsDetails = res.data.bids;


                }
            }, function(err) {
                //$ionicLoading.hide();
            })
        }

        $scope.getConsumer = function() {
            $scope.consumer = {};
            consumer.getConsumerByText($scope.searchText).then(function(res) {
                if (res.status == "success")
                    $scope.consumer = res.data;
                else
                    growl.error(res.error.message);
            })
        }

        $scope.editProfile = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/consumer-edit-profile.html',
                controller: 'ConsumerEditProfileCtrl',
                size: "lg",
                resolve: {
                    items: function() {
                        return $scope.profileEdit;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal fsdfsddismissed at: ' + new Date());
                getConsumerProfile($scope.consumerId);
            });
        };
        $scope.dataset = false;
        $scope.openconsumersCategories = function() {
            var data = {
                consumerId: $scope.consumerId,
                confirmationId: ""
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'views/selles-consumers.html',
                controller: 'SellConsumerCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    ids: function() {
                        return data;
                    }
                }

            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function(res) {
                var params = {
                    "consumerid": $scope.consumerId,
                    "size": 30,
                    "page": $scope.pages,
                    "status": "pending"
                };
                getConsumerAppointments(params);
                $log.info('Modal dismissed atdfsdfdsf: ' + new Date());


            });


        };
        $scope.addAppointmentCategories = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/addconsumers.html',
                controller: 'AddConsumerCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    ids: function() {
                        return $scope.consumerId;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function(res) {

                var params = {
                    "consumerid": $scope.consumerId,
                    "size": 30,
                    "page": $scope.pages,
                    "status": "pending"
                };
                getConsumerAppointments(params);
                $log.info('Modal dismissed atdfsdfdsf: ' + new Date());

            });

        }
        $scope.addbidCategories = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/addbids.html',
                controller: 'AddBidCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    ids: function() {
                        return $scope.consumerId;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function(res) {
                if (res == 'ok') {
                    var params = {
                        "consumerid": $scope.consumerId,
                        "size": 30,
                        "page": $scope.pages,
                        "status": "pending"
                    };
                    getConsumerBids(params);
                    $log.info('Modal dismissed at: ' + new Date());
                }
            });
        }

        $scope.sendData = function(pickup) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/consumer-pickups-modal.html',
                controller: 'ConsumerPickupsModalCtrl',
                size: "lg",
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
                var params = {
                    "consumerid": $scope.consumerId,
                    "size": 30,
                    "page": $scope.pages,
                    "status": "pending"
                };
                getConsumerAppointments(params);
            });
            pickupInstance.closed.then(function(selectedItem) {
                $scope.selected = selectedItem;

            }, function() {

                $log.info('Modal dismissed at: ' + new Date());
                var params = {
                    "consumerid": $scope.consumerId,
                    "size": 30,
                    "page": $scope.pages,
                    "status": "pending"
                };
                getConsumerAppointments(params);
            });
            
        };
        $scope.detailBid = function(bid) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/consumer-bids-modal.html',
                controller: 'ConsumerBidsModalCtrl',
                size: "md",
                resolve: {
                    items: function() {

                        return bid;
                    }
                }
            });

            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    });
