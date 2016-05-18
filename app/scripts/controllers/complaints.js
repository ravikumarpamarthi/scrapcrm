'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:ComplaintsCtrl
 * @description
 * # ComplaintsCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('ComplaintsCtrl', function($scope, consumer, ngTableParams, $uibModal, dashboard) {

       $scope.getComplaints=function(){ 
        $scope.tableParams = new ngTableParams({
                   //page: 1,
                   count: 10,
                   paginate: true,
               }, {
                   getData: function($defer, params) {
                       var pageNumber = params.page();
                    var pageSize = params.count();
                    var queryParams = {
                       "size": pageSize,
                       "page": pageNumber,
                        
                    };
                       dashboard.complaints(queryParams).then(function(res) {
                           //console.log(res.data.complaints.length);
                           if (res.data.message != "No records found" && res.data.complaints.length > 0) {
                               params.total(res.data.complaints.length);
       
                               $defer.resolve(res.data.complaints.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                           } else {
                               $scope.noComplaints = "No complaints found";
                           }
                       });
                   }
               });
    }

$scope.getComplaints();
        $scope.showCompaints = function(data) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/complaints-modal.html',
                controller: 'ComplaintsModalCtrl',
                size: 'md',
                resolve: {
                    items: function() {
                        return data;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.tableParams.reload();
            }, function() {

            });
        };
         $scope.postComplaints=function(){
          var modalInstance = $uibModal.open({
                templateUrl: 'views/postcomplaints.html',
                controller: 'PostComplaintsCtrl',
                size: 'lg',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
               $scope.getComplaints();
            });
        };

    });
