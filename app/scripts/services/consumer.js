'use strict';

/**
 * @ngdoc service
 * @name scrapQApp.consumer
 * @description
 * # consumer
 * Factory in the scrapQApp.
 */
angular.module('scrapQcrmApp')
    .factory('consumer', function(httpService, $global) {
        return {
            getConsumerByText: function(text) {
                var url = $global.getApiUrl() + $global.getApiObject().consumerSearch;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            consumerPickupRequest: function() {
                var url = $global.getApiUrl() + $global.getApiObject().consumerSearch;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            complaintsList: function() {
                var url = $global.getApiUrl() + $global.getApiObject().compaints;
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            getConsumer: function(type,key) {
                var url = $global.getApiUrl() + $global.getApiObject().getConsumer.replace(":userType", type).replace(":text", key);
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            usersLoad: function(type) {
                var url = $global.getApiUrl() + $global.getApiObject().usersLoad.replace(":userType", type);
                var $request = httpService.httpRequest(url, "G", "");
                return $request;
            },
            getProfile: function(agentId) {
                var agentId = agentId;
                var url = $global.getApiUrl() + $global.getApiObject().getConsumerProfile.replace(":aid", agentId);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSellRquests: function(agentId) {
                //var agentId=$global.agentId;
                /*var agentId = agentId;
                var params = {};
                params.consumerid = agentId;*/
                var params = "?" + $global.objToQueryString(agentId);
                var url = $global.getApiUrl() + $global.getApiObject().getSellRquests + params;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getSellById: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().getSellById.replace(":id", id);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getBids: function(params) {
                //var consumerId=$global.consumerId;
                /*var params={};
                params.status='pending';*/
                params.page -= 1;
                var params = "?" + $global.objToQueryString(params);
                var url = $global.getApiUrl() + $global.getApiObject().getBids + params;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },

            getBidById: function(id) {
                //var consumerId=$global.consumerId;
                var params = {};
                params.consumerid = id;
                var params = "?" + $global.objToQueryString(params);
                var url = $global.getApiUrl() + $global.getApiObject().getBidById + params;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            userCategories: function() {
                //var params = "?" + $global.objToQueryString(agentId);
                var url = $global.getApiUrl() + $global.getApiObject().userCategories;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },

            updateProfile: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().updateProfile.replace(":id", data.dataType);
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            setDefaultAdd: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().setDefault.replace(":id", id);
                var $request = httpService.httpRequest(url, "P");
                return $request;
            },
            assignAgent: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().assignAgent
                var $request = httpService.httpRequest(url, "P",data);
                return $request;
            },
            getAddress: function(id) {
                var consumerId = id;
                var url = $global.getApiUrl() + $global.getApiObject().getAddress + "?userid=" + consumerId;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getPendingFeedBacks: function(consumer) {
                
                var url = $global.getApiUrl() + $global.getApiObject().getPendingFeedBacks.replace(":cid", consumer);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            pendingAgents: function(consumer) {
                
                var url = $global.getApiUrl() + $global.getApiObject().pendingAgents;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
             
            rejectAgent: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().rejectAgent.replace(":id",data);
                var $request = httpService.httpRequest(url, "P", '');
                return $request;
            },
            refferalCode: function(data) {
                
                var url = $global.getApiUrl() + $global.getApiObject().refferalCode.replace(":regId",data);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
             deleteAddres:function(id){
                var url = $global.getApiUrl() + $global.getApiObject().deleteAddress.replace(":id",id);
                var $request = httpService.httpRequest(url, "P");
                return $request;
            },
            getRatingTags: function(rating) {
                var url = $global.getApiUrl() + $global.getApiObject().getRatingTags.replace(":id", rating);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            getRatings: function(rating) {
                var url = $global.getApiUrl() + $global.getApiObject().getRatings;
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
            checkPendingFeedBacks: function() {
                var cid = $global.consumerId;
                var url = $global.getApiUrl() + $global.getApiObject().getPendingFeedBacks.replace(":cid", cid);
                var $request = httpService.httpRequest(url, "G").then(function(res) {
                    if (res.status == $global.SUCCESS) {
                        if (res.data.feedbacks.length > 0) {
                            feedBack(res.data.feedbacks[0]);
                        } else {
                            $global.feedBackChecked = true;
                        }
                    }
                });

            },
            submitFeedBack: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().submitFeedBack;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
            skipFeedBack: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().skipFeedBack.replace(":id", id);
                var $request = httpService.httpRequest(url, "P");
                return $request;
            },
            complaintsConsumer: function(id) {
                var url = $global.getApiUrl() + $global.getApiObject().complaintsConsumer.replace(":id", id);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            },
             addComment: function(data) {
                var url = $global.getApiUrl() + $global.getApiObject().addComment;
                var $request = httpService.httpRequest(url, "P", data);
                return $request;
            },
             getComments: function(sellId) {
                var url = $global.getApiUrl() + $global.getApiObject().getComments.replace('{sellId}',sellId);
                var $request = httpService.httpRequest(url, "G");
                return $request;
            }
        };
    });
