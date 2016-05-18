'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('AboutCtrl', function($scope, $global, authentication, $state, growl) {
        /*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
         * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
         * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
         *
         * Version: 1.3.6
         *
         */
        $scope.crmlogout = function() {
                $global.removeLocalItem("authentication");
                authentication.logout().then(function(res) {
                    growl.success("SignIn Again");
                    /*$scope.userData = $global.getLocalItem("authentication", true);
                    $global.init();
                    setUserdata();*/
                    $state.go("login");



                });
            }
    });
