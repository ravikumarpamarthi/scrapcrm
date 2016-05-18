'use strict';

angular.module('scrapQcrmApp')
    .controller('ReAssignAgentCtrl', function(SellNow, $scope, $uibModalInstance, growl, $filter, items, consumer) {
        
        $scope.getNearByAgents = function() {
            SellNow.getAgents(items.conLat, items.conLong).then(function(res) {
                if (res.status == 'SUCCESS') {
                    $scope.nearByAgents = res.data.addresses;
                } else {
                    // growl.success(res.error.message || ' Unable To retrive comments');
                }
            })
        }
        $scope.radioClick = function(val) {
            $scope.index = val;
        }
        $scope.sellobjid = items.sellObjId;
        $scope.agentName = items.agentName;        
        $scope.assign = function(sellobjid) {
            if ($scope.index >= 0) {
                var assignNewAgentObj = {};
                assignNewAgentObj.sellObjId = sellobjid;
                assignNewAgentObj.agentObjId = $scope.nearByAgents[$scope.index].userId;
                consumer.assignAgent(assignNewAgentObj).then(function(res) {
                    if (res.status == 'SUCCESS') {
                        growl.success(res.data.message);
                        $scope.ok(res);

                    } else {
                        growl.error(res.error.message);
                    }
                })
            } else {
                $scope.selectAgentError = "Please select agent !";
            }

        }

        $scope.systeAllocation = function(sellObjId) {
            var obj = {
                'sellObjId': sellObjId,
                'agentObjId': "CRMUSER",
            }
            SellNow.declineRequest(obj).then(function(res) {
                if (res.status == "SUCCESS") {
                    growl.success(res.data.message);
                   $scope.ok(res);
                }else if (res.status == "FAILURE"){
                    growl.error(res.error.message);
                }
            })
        }

        $scope.hide = function(){
            $scope.sysAllocation = true;           
        }

        $scope.show = function(){
            $scope.sysAllocation = false;
        }


        $scope.cancel = function(res) {
            $uibModalInstance.close(res);
        };
        $scope.ok = function(res) {
            $uibModalInstance.dismiss(res);
        };









    });
