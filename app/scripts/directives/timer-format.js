'use strict';

/**
 * @ngdoc directive
 * @name scrapQApp.directive:timerFormat
 * @description
 * # timerFormat
 */
angular.module('scrapQcrmApp')
    .directive('timeFormat', function($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                showMeridian: '=',
            },
            link: function(scope, element, attrs, ngModel) {
                var parseTime = function(viewValue) {

                    if (!viewValue) {
                        ngModel.$setValidity('time', true);
                        return null;
                    } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                        ngModel.$setValidity('time', true);
                        return viewValue;
                    } else if (angular.isString(viewValue)) {
                        var timeRegex = /^(0?[0-9]|1[0-2]):[0-5][0-9] ?[a|p]m$/i;
                        if (!scope.showMeridian) {
                            timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                        }
                        if (!timeRegex.test(viewValue)) {
                            ngModel.$setValidity('time', false);
                            return undefined;
                        } else {
                            ngModel.$setValidity('time', true);
                            var date = new Date();
                            var sp = viewValue.split(":");
                            var apm = sp[1].match(/[a|p]m/i);
                            if (apm) {
                                sp[1] = sp[1].replace(/[a|p]m/i, '');
                                if (apm[0].toLowerCase() == 'pm') {
                                    sp[0] = sp[0] + 12;
                                }
                            }
                            date.setHours(sp[0], sp[1]);
                            return date;
                        };
                    } else {
                        ngModel.$setValidity('time', false);
                        return undefined;
                    };
                };

                ngModel.$parsers.push(parseTime);

                var showTime = function(data) {
                    parseTime(data);
                    var timeFormat = (!scope.showMeridian) ? "HH:mm" : "hh:mm a";
                    return $filter('date')(data, timeFormat);
                };
                ngModel.$formatters.push(showTime);
                scope.$watch('showMeridian', function(value) {
                    var myTime = ngModel.$modelValue;
                    if (myTime) {
                        element.val(showTime(myTime));
                    }

                });

            }
        };
    });
