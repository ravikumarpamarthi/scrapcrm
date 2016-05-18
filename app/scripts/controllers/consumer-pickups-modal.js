'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:ConsumerPickupsModalCtrl
 * @description
 * # ConsumerPickupsModalCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('ConsumerPickupsModalCtrl', function($scope, $uibModalInstance, growl, $filter, items, consumer, $uibModal, SellNow) {
        $scope.feedItem = {};

        function resetRatingTags(rating) {

            if (rating && $scope.ratings) {

                $scope.rating = $filter('filter')($scope.ratings, {
                    rating: rating
                })[0];

                $scope.ratingTags = $scope.rating.tags;

            }
        }
        $scope.$watch('feedItem.rating', function(newValue, oldValue) {
            resetRatingTags(newValue);

        });
        $scope.cancel = function(res) {
            $uibModalInstance.close(res);
        };
        $scope.ok = function(res) {
            $uibModalInstance.dismiss(res);
        };

        function getSells() {
            consumer.getSellById(items.confirmationId).then(function(res) {
                $scope.items = res.data.sell;

                getfeendinRatings();

                consumer.getRatings().then(function(res) {
                    $scope.ratings = res.data.ratingInfos

                })
            });
        }
        getSells();

        function getfeendinRatings() {
            $scope.feedback = [];
            consumer.getPendingFeedBacks($scope.items.consumerObjId).then(function(res) {
                if (res.status == "SUCCESS") {
                    var feedbacks = res.data.feedbacks;
                    angular.forEach(feedbacks, function(feed) {

                        if ($scope.items.sellObjId == feed.sellId) // google.maps.setCenter($scope.center);
                        {
                            $scope.feedback.push(feed);
                            $scope.feedItem.feedbackId = feed.feedbackId;

                        }
                        console.log($scope.feedItem.length)
                    });

                }
            });
        }
        $scope.save = function() {
            $scope.submit = true;
            if ($scope.feedItem.rating > 0) {
                consumer.submitFeedBack($scope.feedItem).then(function(res) {
                    if (res.status == "SUCCESS") {
                        growl.success(res.data.message || "Thank you for your feedback");
                        //$global.feedBackChecked = true;
                        //$uibModalInstance.dismiss('cancel');
                        getfeendinRatings();
                    } else {
                        growl.success(res.data.message);
                    }
                })
            }
        }


        $scope.editSellNow = function() {
            $scope.commentStatus = true;
            var data = {
                consumerId: $scope.items.consumerObjId,
                confirmationId: $scope.items.confirmationId
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

                getSells();

            });

        }
        $scope.reAssignAgent = function() {
            $scope.commentStatus = true;
            var data = {
                consumerId: $scope.items.consumerObjId,
                confirmationId: $scope.items.confirmationId,
                conLat: $scope.items.consumerAddress.latitude,
                conLong: $scope.items.consumerAddress.longitude,
                sellObjId: $scope.items.sellObjId,
                agentName: $scope.items.agentName
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'views/reassign-agent-modal.html',
                controller: 'ReAssignAgentCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    items: function() {
                        return data;
                    }
                }

            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;

            }, function(res) {

                getSells();

            });

        }

        function getComments() {
            consumer.getComments(items.sellObjId).then(function(res) {
                if (res.status == 'SUCCESS') {
                    $scope.sellComments = res.data.comments;
                } else {
                    growl.success(res.error.message || ' Unable To retrive comments');
                }
            })
        }
        getComments();
        $scope.saveComment = function() {
            $scope.commentStatus = true;
            var obj = {
                objId: items.sellObjId,
                comment: $scope.comments.comment
            }
            consumer.addComment(obj).then(function(res) {
                if (res.status == 'SUCCESS') {
                    growl.success(res.data.message || ' Comment added successfully');
                }
                $scope.comments.comment = '';
                getComments();
                $scope.commentStatus = false;
            })
        }

        $scope.updateDetails = function() {
            $scope.commentStatus = true;
            var id = $scope.items.confirmationId;
            var items = $scope.items;
            var modalInstance = $uibModal.open({
                templateUrl: 'views/add-items.html',
                controller: 'AddItemsCtrl',
                size: "lg",
                resolve: {
                    items: function() {
                        return id;
                    },
                    item: function() {
                        return items;
                    }
                    
                }
            });

            modalInstance.result.then(function(data) {
                // $scope.selected = selectedItem; 
                // getAgentAppointments($scope.vm.params);
                getSells();
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        $scope.declineSellItem = function() {
            $scope.commentStatus = true;
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/deleteConfirmation.html',
                controller: "DeleteCtrl",
                size: "md",
                resolve: {
                    items: function() {

                        return items;
                    }
                }
            });
            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem; 
                getSells();
            }, function() {                


            });
        }
        $scope.declineByCrm = function() {
            $scope.commentStatus = true;
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/deleteConfirmation.html',
                controller: "DeleteCtrl",
                size: "md",
                resolve: {
                    items: function() {

                        return items;
                    }
                }
            });
            pickupInstance.result.then(function(selectedItem) {
                var obj = {
                    'sellObjId': items.sellObjId,
                    'agentObjId': "CRMUSER",
                }
                SellNow.declineRequest(obj).then(function(res) {
                    if (res.status == "SUCCESS") {
                        growl.success(res.data.message);
                        $scope.ok(res);
                    } else if (res.status == "FAILURE") {
                        growl.error(res.error.message);
                    }
                })
            }, function() {




            });

        }
        $scope.cancelSellItem = function() {
            $scope.commentStatus = true;
            var pickupInstance = $uibModal.open({
                templateUrl: 'views/cancelConfirmation.html',
                controller: "DeleteCtrl",
                size: "md",
                resolve: {
                    items: function() {

                        return items;
                    }
                }
            });
            pickupInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem; 
                getSells();                
            }, function() {

            });
        }

    });
