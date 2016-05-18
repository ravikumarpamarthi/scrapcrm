'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:AgentsCtrl
 * @description
 * # AgentsCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('AgentsCtrl', function($scope, $global, $uibModal, $window, SellNow, growl, $log, agentService, $stateParams) {
        $scope.searchAgent = function(key) {
            var type = 'AGENT';
            $scope.submitted = true;
            $scope.transactionStatus = "pending";
            $scope.vm = {};
            if (!$scope.form.$valid) {
                return false;
            } else {
                $scope.noAgentFound = false;
                agentService.getAgent(type, key).then(function(res) {
                    if (res.status == "SUCCESS") { //&& res.data.usersuserType == "AGENT"                        
                        $scope.agents = res.data;
                        if(res.data.users.length == 1){
                            $scope.length0 = true;
                            $scope.agentDetails(0);
                        }else {                        
                            $scope.agent_list = res.data.users;
                            $scope.length0 = false;
                            $scope.agentId = false;
                        }  
                        if(res.data.message == "No records found"){
                            $scope.noAgentFound = true;
                        }                      
                        // $scope.agentId = res.data.userId;
                        // getAgentProfile($scope.agentId);
                        // $scope.vm.params = {
                        //     "agentid": res.data.userId,
                        //     "size": 10,
                        //     "page": 0,
                        //     "status": "pending"
                        // };
                        // getAgentAppointments($scope.vm.params);
                    } else if (res.status == "FAILURE") {
                        $scope.noAgentFound = true;
                    } else {
                        $scope.noAgentFound = true;
                    }


                }, function(err) {

                })

            }




        };
         $scope.loadAgents = function() {
            var type = 'AGENT';
            $scope.submitted = true;
            $scope.transactionStatus = "pending";
            $scope.vm = {};
            $scope.noAgentFound = false;
                agentService.usersLoad(type).then(function(res) {
                    if (res.status == "SUCCESS") { //&& res.data.usersuserType == "AGENT"                        
                        $scope.agents = res.data;
                        if(res.data.users.length == 1){
                            $scope.length0 = true;
                            $scope.agentDetails(0);
                        }else {                        
                            $scope.agent_list = res.data.users;
                            $scope.length0 = false;
                            $scope.agentId = false;
                        }  
                        if(res.data.message == "No records found"){
                            $scope.noAgentFound = true;
                        }
                    } else if (res.status == "FAILURE") {
                        $scope.noAgentFound = true;
                    } else {
                        $scope.noAgentFound = true;
                    }
                }, function(err) {

                })
        };
        $scope.loadAgents();
        $scope.agentDetails = function(val) {
            $scope.length0 = true;
            var details = $scope.agents.users[val];
            $scope.agentId = details.userId;
            getAgentProfile($scope.agentId);
            $scope.agent_list = false;
            $scope.vm.params = {
                "agentid": details.userId,
                "size": 10,
                "page": 0,
                "status": "pending"
            };
            getAgentAppointments($scope.vm.params);
        }
        $scope.addAgents = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/add-user.html',
                controller: 'AddUserCtrl',
                size: "lg",
                resolve: {
                    items: function() {
                        return 'AGENT';
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

        function getAgentProfile(agentId) {
            agentService.getProfile(agentId).then(function(res) {
                if (res.status == "SUCCESS") {
                    $scope.profileEdit = res.data.agent;
                    $scope.profileEdit.rating = parseInt($scope.profileEdit.rating);
                } else if (res.status == "FAILURE") {
                    $scope.noAgentFound = "No agent record found";
                }
                //$scope.profileEdit = res.data.agent;
            }, function(err) {
                console.log(err);
            })
        }
        $scope.currentPage = 1;
        $scope.transactionChange = function(status) {
            $scope.totalAgentRecords = 0;
            $scope.currentPage = 1;
            $scope.vm.params.page = 0;
            $scope.vm.params.status = status;
            getAgentAppointments($scope.vm.params);
        };
        $scope.pageChanged = function(currentPage) {
            $scope.vm.params.page = currentPage - 1;
            getAgentAppointments($scope.vm.params);
        }
        $scope.selectPage = function() {

        }

        function getAgentAppointments(params) {
            agentService.getSellRquests(params).then(function(res) {
                $scope.totalAgentRecords = res.data.totalRecords;
                if (res.status == 'SUCCESS') {
                    $scope.todayAppointment = [];
                    $scope.upcomingAppointment = [];
                    $scope.todayAppointment = res.data.sells;
                }
            }, function(err) {

            })
        }







        $scope.showPricerate = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/agents-prices.html',
                controller: 'PriceCtrl',
                size: "md",
                resolve: {
                    items: function() {
                        return;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        $scope.editAgentDetails = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/agent-edit-profile.html',
                controller: 'AgentEditProfileCtrl',
                size: "md",
                resolve: {
                    items: function() {
                        return $scope.profileEdit;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
                getAgentProfile($scope.agentId);
            });
        };
        $scope.viewAppointment = function(view) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/agent-today-appointments.html',
                controller: 'AgentTodayAppointmentsCtrl',
                size: "lg",
                resolve: {
                    items: function() {

                        return view;
                    }
                }
            });

            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        $scope.upcomingAppointments = function(upview) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/agent-upcoming-appointments.html',
                controller: 'AgentUpcomingAppointmentsCtrl',
                size: "md",
                resolve: {
                    items: function() {

                        return upview;
                    }
                }
            });

            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        $scope.agentBid = function(bid) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/agent-bids.html',
                controller: 'AgentBidsCtrl',
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
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.updateDetails = function(id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/add-items.html',
                controller: 'AddItemsCtrl',
                size: "lg",
                resolve: {
                    items: function() {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                getAgentAppointments($scope.vm.params);
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
        $scope.rescheduleConfirmation = function(sell, index) {
            var reschedule = {
                    'sellObjId': sell.sellObjId,
                    'agentObjId': sell.agentObjId,
                }
                // $scope.showRescheduleModal(sell.preferredSlot);
            var reschedule = $uibModal.open({
                templateUrl: 'views/reschedule-modal.html',
                controller: "ReschduleCtrl",
                size: "md",
                resolve: {
                    items: function() {

                        return reschedule;
                    }
                }
            });
            reschedule.result.then(function(selectedItem) {
                getAgentAppointments($scope.vm.params);
            }, function() {

            });

        };
        $scope.declineSellItem = function(sell, index) {
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/deleteConfirmation.html',
                controller: "DeleteCtrl",
                size: "md",
                resolve: {
                    items: function() {

                        return sell;
                    }
                }
            });
            pickupInstance.result.then(function(selectedItem) {
                var obj = {
                    'sellObjId': sell.sellObjId,
                    'agentObjId': sell.agentObjId,
                }
                SellNow.declineRequest(obj).then(function(res) {
                    if (res.status == "SUCCESS") {
                        $scope.todayAppointment.splice(index, 1);


                    }
                })
            }, function() {




            });
        }
    });
