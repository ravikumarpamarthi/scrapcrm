'use strict';

/**
 * @ngdoc directive
 * @name scrapQApp.directive:timepickerPop
 * @description
 * # timepickerPop
 */
angular.module('scrapQcrmApp')
  .directive('timepickerPop', function ($document) {
        return {
            restrict: 'E',
            transclude: false,
            scope: {
                inputTime: "=",
                showMeridian: "="
            },
            controller: function($scope, $element) {
                $scope.isOpen = false;

                $scope.toggle = function() {
                    $scope.isOpen = !$scope.isOpen;
                };

                $scope.open = function() {
                    $scope.isOpen = true;
                };
            },
            link: function(scope, element, attrs) {
                scope.$watch("inputTime", function(value) {
                    if (!scope.inputTime) {
                        element.addClass('has-error');
                    } else {
                        element.removeClass('has-error');
                    }

                });

                element.bind('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });

                $document.bind('click', function(event) {
                    scope.$apply(function() {
                        scope.isOpen = false;
                    });
                });

            },
            template: "<input type='text' class='form-control' ng-model='inputTime'  time-format  ng-focus='open()' />" + "  <div class='input-group-btn' ng-class='{open:isOpen}'> " + "    <button type='button' class='btn btn-default ' ng-class=\"{'btn-primary':isOpen}\" data-toggle='dropdown' ng-click='toggle()'> " + "        <i class='glyphicon glyphicon-time'></i></button> " + "          <div class='dropdown-menu pull-right'> "

                + "            <div><uib-timepicker ng-model='inputTime'  ></uib-timepicker></div> " + "           </div> " + "  </div>"
        };
    });
