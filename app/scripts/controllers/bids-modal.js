'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:BidsModalCtrl
 * @description
 * # BidsModalCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('BidsModalCtrl', function($scope, localStorageService, $uibModalInstance, items, BidService) {

        BidService.getBidById(items).then(function(res) {
                if (res.status == 'SUCCESS') {

                    $scope.items = res.data.bid;


                }
            }, function(err) {
                //$ionicLoading.hide();
            })
            /*      $scope.data={};
     $scope.data.complaintDescription=localStorageService.get(items);
        //$scope.items = items;
        $scope.save=function(){
             localStorageService.set(items, $scope.data.complaintDescription);
          $uibModalInstance.dismiss(items);
      };*/
        $scope.cancel = function() {
            $uibModalInstance.close('cancel');
        };
    });
