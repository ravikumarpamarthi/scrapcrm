'use strict';

/**
 * @ngdoc directive
 * @name scrapQApp.directive:googleplace
 * @description
 * # googleplace
 */
angular.module('scrapQcrmApp')
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '=',
                details: '=?'
            },
            link: function(scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: {}
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    scope.$apply(function() {
                        scope.details = scope.gPlace.getPlace();
                        model.$setViewValue(element.val());
                        var pos = [];
                        var location = scope.details.geometry.location;
                        pos.push(location.lat());
                        pos.push(location.lng());
                        scope.positions = [{
                            pos: pos
                        }];
                        scope.center = pos;
                    });
                });
            }
        };
    });