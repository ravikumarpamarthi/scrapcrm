'use strict';

/**
 * @ngdoc function
 * @name scrapQApp.controller:AgentUpcomingAppointmentsCtrl
 * @description
 * # AgentUpcomingAppointmentsCtrl
 * Controller of the scrapQApp
 */
angular.module('scrapQcrmApp')
    .controller('AgentUpcomingAppointmentsCtrl', function($scope, $uibModalInstance, items, agentService) {
        $scope.items = items;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        agentService.getSellById($scope.items.confirmationId).then(function(res) {
            console.log(res);

        });
    });
