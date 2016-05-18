'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('ComplaintViewCtrl', function($scope, authentication,$uibModalInstance,items) {
        $scope.items=items;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }; 
        
    });
