'use strict';

angular.module('scrapQcrmApp')
    .controller('LoginCtrl', function($state, $scope, $global, authentication) {
        $scope.validate = function() {
            $scope.isUsername = $scope.crmLoginForm.userName.$error.required;
            $scope.isPassword = $scope.crmLoginForm.password.$error.required;
        };
        $scope.loginInfo={}
        $scope.loginInfo.userName='9603896973';
        $scope.loginInfo.password='digitele';
        $scope.doLogin = function(data) {
            $scope.loginError = null;

            $scope.submit = true;
            if (data != undefined) {

                if ($scope.crmLoginForm.$valid) {
                    authentication.login(data).then(function(res) {
                        if (res.status == 'SUCCESS') {
                            $global.setLocalItem("authentication", res, true);
                            //$ionicLoading.hide();
                            $state.go("root.dashboard");
                        } else if (res.status == 'FAILURE') {
                            //$ionicLoading.hide();
                            $scope.loginError = "Invalid username or password";
                        }
                    }, function(err) {
                        //console.log(err);
                        //$scope.loginError = err.message;
                        //$ionicLoading.hide();
                    });
                }

            }


        }
    });
