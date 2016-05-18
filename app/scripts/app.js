'use strict';

/**
 * @ngdoc overview
 * @name scrapQcrmApp
 * @description
 * # scrapQcrmApp
 *
 * Main module of the application.
 */
angular.module('scrapQcrmApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'angular-loading-bar',
        'LocalStorageModule',
        'environment',
        'ui.bootstrap',
        'angular-growl',
        'base64',
        'geolocation',
        'ngFileUpload',
        'ngMessages',
        'checklist-model',
        'ngTable',
        'angular-momentjs',
        'ngMap',
        'ui.calendar',
        'daterangepicker',
        'datatables'
    ])
    .config(function($stateProvider, $urlRouterProvider, growlProvider, $sceProvider, envServiceProvider, cfpLoadingBarProvider, localStorageServiceProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
        $sceProvider.enabled(true);

        localStorageServiceProvider.setPrefix('scrapQApp')
            .setStorageType('localStorage')
            .setNotify(true, true);
        growlProvider.globalTimeToLive(2000);

        var restApi = {
                "dashboard": "/api/dashboard/statistics",
                "pendingOtps": "/api/registrations",
                "pendingRequests": "/api/sells",
                "allRequests": "/api/dashboard/requests/all",
                "products": "/api/categories",
                "uploadFile": "/filemanager/uploadFile",
                "addProducts": "/api/category",
                "editProduct": "/api/category/:id",
                "complaints": "/api/complaints",
                "complaintRemark": "/api/complaint/remarks",
                "updateProducts": "/api/updatecategory",
                "priceUpdate": "/api/category/price",
                "login": "/api/auth/login",
                "logout": "/api/auth/logout",
                "getConsumer": "/api/user/:userType/search/:text ",
                // "getAgent": "/api/registration",
                "getAgent": "/api/user/:userType/search/:text ",               
                "getAgentProfile": "/api/agent/profile/:aid",
                "getConsumerProfile": "/api/consumer/profile/:aid",
                "getSellRquests": "/api/sells",
                "getSellById": "/api/sell/:id",
                "getBidById": "/api/bid/:id",
                "signup": "/api/registration/crm/user",
                "saveAddress": "/api/address",
                "getImageFileById": "/fileManager/getImageFileById",
                "sellNowPickup": "/api/sell/pickup",
                "sellNowDrop": "/api/sell/drop",
                "getSellById": "/api/sell/:id",
                "getSlots": "/api/sell/slots/available",
                "getAddress": "/api/addresses",
                "cancelSellRquests": "/api/sell/:cid/cancel",
                "getAgentsByLatLng": "/api/addresses/lng/:lng/lat/:lat/agents",
                "getBids": "/api/bids",
                "placeBid": "/api/bid",
                "userCategories": "/api/consumer/categories",
                "updateProfile": "/api/:id/profile",
                "setDefault": "/api/address/:id/default",
                "getPendingFeedBacks": "/api/feedbacks?consumerid=:cid&status=completed",
                "complaintsCategory": "/api/complaint/categories",
                "complaintsType": "/api/complaint/:cid/types",
                "saveComplaints": "/api/complaint",
                "pendingAgents": "/api/registrations?userType=SQAGENT",
                "usersLoad": "/api/registrations?userType=:userType",
                "assignAgent": "/api/sell/assign",
                "unavilable": "/api/agent/TODAY/:status/count",
                "sellCount": "/api/sell/TODAY/counts",
                "rejectAgent": "/api/sell/:id/reject",
                "refferalCode": "/api/registrations/referred/:regId",
                "deleteAddress": "/api/address/:id/deleteaddress",
                "updatePickup": "/api/sell/:sellId/pickup",
                "updateDrop": "/api/sell/:sellId/drop",
                "getRatings": "/api/feedback/ratings",
                "getPendingFeedBacks": "/api/feedbacks?consumerid=:cid&status=pending",
                "getRatingTags": "/api/feedback/rating/:id",
                "submitFeedBack": "/api/feedback",
                "skipFeedBack": "/api/feedback/:id/skip",
                "addComment": "/api/sell/comment",
                "getComments": "/api/sell/{sellId}/comments",
                 updateSellItems: "/api/sell/items",
                completeSellItems: "/api/sell/complete",
                declineRequest: "/api/sell/decline",
                reschedule: "/api/sell/reschedule",
                getCalendar: "/api/sell/calendar/from/:from/to/:to",

            }
            /* environment start*/
        envServiceProvider.config({
            vars: {
                development: {
                    // apiUrl: 'http://localhost:9003'http://192.168.101.99,
                    // apiUrl: 'http://10.80.80.121:8080/rest',
                    apiUrl: 'http://192.168.101.216:8080/rest',
                    //apiUrl:'http://scrapq.digitelenetworks.com/scrapq',
                    //apiUrl: 'http://192.168.101.35:9080/scrapq-restcontroller',
                    // apiUrl: 'http://localhost:9080/scrapq-restcontroller',
                    staticUrl: 'http://localhost:9000',
                    restApi: restApi
                },
                production: {
                    apiUrl: 'http://scrapq.digitelenetworks.com/scrapq',
                    staticUrl: 'http://scrapq.digitelenetworks.com/scrapq',
                    restApi: restApi
                }
            }
        });

        envServiceProvider.check();
        envServiceProvider.set('production');
        /* environment end*/

        $urlRouterProvider.otherwise("dashboard");
        $stateProvider.state('root', {
                url: '',
                views: {
                    "content@": {
                        controller: function($state) {
                            $state.go('root.dashboard');
                        }
                    },
                    'header': {
                        templateUrl: "views/header.html",
                        controller: "AboutCtrl"
                    },
                    'header-aside': {
                        templateUrl: "views/header-aside.html",
                        controller: "HeaderCtrl"
                    },
                    'footer': {
                        templateUrl: "views/footer.html",
                        // controller:"HeaderCtrl"
                    },
                }
            })
            .state('root.dashboard', {
                url: "/dashboard",
                views: {
                    "content@": {
                        templateUrl: "views/dashboard.html",
                        controller: 'DashboardCtrl'
                    }
                }
            })
            .state('login', {
                url: "/login",
                views: {

                    "content@": {
                        templateUrl: "views/login.html",
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('root.add-user', {
                url: "/add-user/:id",
                views: {
                    "content@": {
                        templateUrl: "views/add-user.html",
                        controller: 'AddUserCtrl'
                    }
                }
            }).state('root.pending-otps', {
                url: "/pending-registration",
                views: {
                    "content@": {
                        templateUrl: "views/pending-otps.html",
                        controller: 'PendingOtpsCtrl'
                    }
                }
            }).state('root.pending-requests', {
                url: "/pending-requests/:fromdate/:todate",
                views: {
                    "content@": {
                        templateUrl: "views/pending-requests.html",
                        controller: 'PendingRequestsCtrl'
                    }
                }
            })
            .state('root.consumer', {
                url: "/consumers",
                views: {
                    "content@": {
                        templateUrl: "views/consumers.html",
                        controller: 'ConsumerCtrl'
                    }
                }
            }).state('root.agents', {
                url: "/agents",
                views: {
                    "content@": {
                        templateUrl: "views/agents.html",
                        controller: 'AgentsCtrl'
                    }
                }
            }).state('root.agents-appiontments', {
                url: "/agents-appiontments",
                views: {
                    "content@": {
                        templateUrl: "views/agents-appiontments.html",
                        controller: 'AgentsAppiontmentsCtrl'
                    }
                }
            }).state('root.bids', {
                url: "/bids",
                views: {
                    "content@": {
                        templateUrl: "views/bids.html",
                        controller: 'BidsCtrl'
                    }
                }
            }).state('root.products', {
                url: "/products",
                views: {
                    "content@": {
                        templateUrl: "views/products.html",
                        controller: 'ProductsCtrl'
                    }
                }
            }).state('root.add-product', {
                url: "/add-product",
                views: {
                    "content@": {
                        templateUrl: "views/add-product.html",
                        controller: 'AddProductCtrl'
                    }
                }
            }).state('root.edit-product', {
                url: "/edit-product/:id",
                views: {
                    "content@": {
                        templateUrl: "views/edit-product.html",
                        controller: 'EditProductCtrl'
                    }
                }
            }).state('root.complaints', {
                url: "/complaints",
                views: {
                    "content@": {
                        templateUrl: "views/complaints.html",
                        controller: 'ComplaintsCtrl'
                    }
                }
            }).state('root.sellsconsumer', {
                url: "/sellconsumer",
                views: {
                    "content@": {
                        templateUrl: "views/selles-consumers.html",
                        controller: 'SellConsumerCtrl'
                    }
                }
            }).state('root.tablerow', {
                url: "/tablerow",
                views: {
                    "content@": {
                        templateUrl: "views/about.html",
                        controller: 'AboutCtrl'
                    }
                }
            }).state('root.unassigned', {
                url: "/unassigned/:fromdate/:todate",
                views: {
                    "content@": {
                        templateUrl: 'views/un-assigned.html',
                        controller: 'UnAssginedCtrl',
                    }
                }
            }).state('root.completed', {
                url: "/completed/:fromdate/:todate",
                views: {
                    "content@": {
                        templateUrl: 'views/completed-requests.html',
                        controller: 'CompletedCtrl',
                    }
                }
            }).state('root.cancelled', {
                url: "/cancelled/:fromdate/:todate",
                views: {
                    "content@": {
                        templateUrl: 'views/canceled-requests.html',
                        controller: 'CancelledCtrl',
                    }
                }
            }).state('root.declined', {
                url: "/declined/:fromdate/:todate",
                views: {
                    "content@": {
                        templateUrl: 'views/declined-requests.html',
                        controller: 'DeclinedCtrl',
                    }
                }
            }).state('root.appointments', {
                url: "/appointments",
                views: {
                    "content@": {
                        templateUrl: 'views/appointments.html',
                        controller: 'AppointmentCtrl',
                    }
                }
            });
    }).run(function($state, $global, $rootScope) {



        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            var isLogin = toState.name === 'login';
            $global.init();
            $rootScope.$emit('initMenu', "ok");
            if (isLogin) {
                $global.removeLocalItem("authentication");
                $global.removeLocalItem("sellReuestItems");
                $global.removeLocalItem("registration");
                $rootScope.$emit('initMenu', "ok");
                return;
            } else {
                var toStateName = toState.name;
                if (toStateName == 'root.faq' || toStateName == 'root.about' || toStateName == 'root.otp' || toStateName == 'root.registration' || toStateName == 'root.forgotpassword') {
                    return;
                }
                if ($global.authentication == null || $global.authentication == undefined || $global.authentication == '') {
                    e.preventDefault();
                    $state.go('login');
                    return;
                }

            }
        });
    });
