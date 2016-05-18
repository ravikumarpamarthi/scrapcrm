'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('AddItemsCtrl', function($scope,item, $global,$filter , $uibModalInstance, authentication, agentService, SellNow, products, $state, growl, items) {
        $scope.items = item;        
        $scope.items.agentObjId = item.agentObjId;
        $scope.paymentModes = $global.paymentModes;
        products.getProducts().then(function(res) {
            if (res.status == 'SUCCESS') {
                $scope.categories = res.data.categories;
            }
        });

        SellNow.getSellById(items).then(function(res) {
            $scope.sell = res.data.sell;
            $scope.data = prePareSellItemsObj(res.data.sell);
            $scope.data.preferredPaymentMethod=$global.paymentModes[0].value

        });
        $scope.openSellItemsModal=function(){
            $scope.showItemsGrid=true;
        }
        $scope.removeSellItem = function(index) {
            $scope.data.items.splice(index, 1);
        }
        $scope.ok = function(data) {
            $uibModalInstance.close(data);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };

        function prePareSellItemsObj(items) {
            if (!items.preferredPaymentMethod) {
                items.preferredPaymentMethod = $scope.paymentModes[0].value;
            }
            var obj = {
                'sellObjId': items.sellObjId,
                'agentObjId': items.agentObjId,
                'preferredPaymentMethod': items.preferredPaymentMethod,
                'items': []
            }
            for (var i = items.items.length - 1; i >= 0; i--) {
                var category = {
                    'categoryId': items.items[i].categoryId,
                    'categoryName': items.items[i].categoryName,
                    'image': items.items[i].image,
                    'pricePerUnit': items.items[i].pricePerUnit,
                    'quantity': items.items[i].quantity
                };
                obj.items.push(category);
            };
            return obj;
        }


        function checkSellItemIsAdded(categoryId) {
            return $filter('filter')($scope.data.items, {
                categoryId: categoryId
            })[0];
        }
        $scope.getTotoal = function() {
            var tot = 0;
            if ($scope.data && $scope.data.items)
                for (var i = $scope.data.items.length - 1; i >= 0; i--) {
                    tot = tot + parseFloat($scope.data.items[i].pricePerUnit * $scope.data.items[i].quantity);
                };
            return tot;
        }
        $scope.addItems = function() {
            var items = $scope.modaldata;
            for (var i = items.length - 1; i >= 0; i--) {
                if (items[i] && items[i].items && items[i].items.length > 0) {
                    var item = items[i].items[0];
                    var category = {
                        'categoryId': item.categoryId,
                        'categoryName': item.name,
                        'image': item.image,
                        'pricePerUnit': item.price,
                        'quantity': items[i].qty
                    };
                    if (!checkSellItemIsAdded(category.categoryId)) {
                        // $scope.categories.push(categories[i]);
                        $scope.data.items.push(category);
                    }

                }
            };
            $scope.modaldata = [];
            $scope.showItemsGrid=false;
        }

        $scope.modaldata = [];
        $scope.modaldecreaseQty = function(index) {
            if ($scope.modaldata[index].qty > 1)
                $scope.modaldata[index].qty = parseInt($scope.modaldata[index].qty) - 1;
        }
        $scope.modalincreaseQty = function(index) {
            $scope.modaldata[index].qty = parseInt($scope.modaldata[index].qty) + 1;
        }


        $scope.decreaseQty = function(index) {
            if ($scope.data.items[index].quantity > 1)
                $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) - 1;
        }
        $scope.increaseQty = function(index) {
            $scope.data.items[index].quantity = parseInt($scope.data.items[index].quantity) + 1;
        }
        $scope.decreasePrice = function(index) {
            if ($scope.data.items[index].pricePerUnit > 1)
                $scope.data.items[index].pricePerUnit = parseFloat($scope.data.items[index].pricePerUnit) - 1;
        }
        $scope.increasePrice = function(index) {
            $scope.data.items[index].pricePerUnit = parseFloat($scope.data.items[index].pricePerUnit) + 1;
        }

        $scope.updateSellItems = function() {
            
            SellNow.updateSellItems($scope.data).then(function(res) {
                if (res.status == 'SUCCESS') {
                    var obj = {
                        'sellObjId': $scope.data.sellObjId,
                        'agentObjId': $scope.data.agentObjId,
                    }
                    $scope.items.agentObjId = true;
                    SellNow.completeSellItems(obj).then(function(res) {
                         growl.success("Successfully Updated");
                         $scope.ok(res);
                        
                    })

                } else if (res.status =='FAILURE') {
                    
                }

            })
        }
    });
