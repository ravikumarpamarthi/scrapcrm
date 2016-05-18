'use strict';

/**
 * @ngdoc function
 * @name scrapQcrmApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the scrapQcrmApp
 */
angular.module('scrapQcrmApp')
    .controller('DashboardCtrl', function($scope, dashboard, $moment, uiCalendarConfig,$state) {
        $scope.todayDate = moment().format('DD-MMM-YYYY');
        $scope.status = "unavailable",

            dashboard.unavailable($scope.status).then(function(res) {
                $scope.UnavailableAgentCount = res.data.counts[0].value;
            });
        dashboard.sellCount().then(function(res) {
            //console.log(res.data.counts);
            angular.forEach(res.data.counts, function(data, key) {

                if (data.name == "ASSIGNED_TO_AGENT") {
                    $scope.pending = data.value;
                }
                if (data.name == "REQUEST_COMPLETED") {
                    $scope.completed = data.value;
                }
                if (data.name == "DECLINED_BY_AGENT") {
                    $scope.declined = data.value;
                }
                if (data.name == "CANCELLED_BY_CONSUMER") {
                    $scope.cancelled = data.value;
                }
                if (data.name == "REQUEST_INITIATED") {
                    $scope.req_initiated = data.value;
                }
                if (data.name == "REQUEST_CLOSED") {
                    $scope.req_closed = data.value;
                }
                if (data.name == "REJECTED_BY_CRM") {
                    $scope.rej_by_crm = data.value;
                }

                // if (data.name == "CANCELLED_BY_CONSUMER") {
                //     $scope.cancelled = data.value;
                // }
                // if (data.name == "ASSIGNED_TO_AGENT") {
                //     $scope.ASSIGNED_TO_AGENT = data.value;
                // }
                
                
                
                // if (data.name == "UNASSIGNED") {
                //     $scope.unassigned = data.value;
                // }
                

            })
        });

        dashboard.statistics().then(function(res) {
            if (res.status == "SUCCESS") {
                var statistics = res.data.userList;
                for (var i = statistics.length - 1; i >= 0; i--) {
                    if (statistics[i].usertype == 'AGENT') {
                        $scope.agentCount = statistics[i].count;
                    }
                    if (statistics[i].usertype == 'CONSUMER') {
                        $scope.consumerCount = statistics[i].count;
                    }

                };
                $scope.requestList = res.data.requestList;
                $scope.otpCount = res.data.otpCount;
                $scope.responseCount = parseInt($scope.requestList[0].count) + parseInt($scope.requestList[1].count)

            }


        }, function(err) {
            console.log(err);
        });


        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.changeTo = 'Hungarian';

        var reqObj;

        function getCalenderInfo(from, to) {
            dashboard.getCalendar(from, to).then(function(res) {
                reqObj = res.data.sellCalendars;
                parseCalenderObj(reqObj);
            });
        }
        $scope.events = [];
        $scope.monthEvents = [];

        function parseCalenderObj(reqObj) {
            $scope.monthEvents.splice(0, $scope.monthEvents.length);
            $scope.events.splice(0, $scope.events.length);
            uiCalendarConfig.calendars['myCalendar'].fullCalendar('removeEvents');
            for (var i = reqObj.length - 1; i >= 0; i--) {
                var month = {
                    title: reqObj[i].dayCount,
                    start: reqObj[i].day

                };
                $scope.monthEvents.push(month);
                for (var j = reqObj[i].slotWiseCounts.length - 1; j >= 0; j--) {
                    var obj = {
                        title: reqObj[i].slotWiseCounts[j].value,
                        dayCount: reqObj[i].dayCount,
                    };
                    var slot = reqObj[i].slotWiseCounts[j].name.split('-');
                    obj.start = reqObj[i].day + 'T' + slot[0] + ':00';
                    obj.end = reqObj[i].day + 'T' + slot[1] + ':00';
                    $scope.events.push(obj);
                };
            };
        }
        $scope.eventSources = [];
        $scope.eventSources.push($scope.monthEvents);
        $scope.appointmentList = function(date, jsEvent, view) {
            var caseNumber = Math.floor((Math.abs(jsEvent.offsetX + jsEvent.currentTarget.offsetLeft) / $(this).parent().parent().width() * 100) / (100 / 7));
            var table = $(this).parent().parent().parent().parent().children();
            $(table).each(function() {
                if ($(this).is('thead')) {
                    var tds = $(this).children().children();
                    var dateClicked = $(tds[caseNumber]).attr("data-date");
                    dateClicked=moment(dateClicked, 'YYYY-MM-DD').format('DD-MMM-YYYY');
                    $state.go('root.pending-requests',{fromdate:dateClicked,todate:dateClicked})
                }
            });
          
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'agendaDay agendaWeek month prev,next'
                },
                events: function(start, end) {
                    getCalenderInfo(start.format("DD-MMM-YYYY"), end.format("DD-MMM-YYYY"));
                },
                eventRender: function(event, element, view) {
                    if (view.name == "month") {
                        element.find('.fc-title').html(event.dayCount);
                    } else {
                        event.title = event.title;
                    }
                },
                viewRender: function(view, element) {

                    if (view.name == "month") {
                        setEvents($scope.monthEvents)
                    } else {
                        setEvents($scope.events)
                    }
                },
                eventClick: $scope.appointmentList,
                /* dayClick: function(date, jsEvent, view) {

                     alert('Clicked on: ' + date.format());

                     alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

                     alert('Current view: ' + view.name);

                     // change the day's background color just for fun
                     $(this).css('background-color', 'red');

                 },*/
                // eventBackgroundColor: '#378006'
                // eventDrop: $scope.alertOnDrop,
                // eventResize: $scope.alertOnResize,
                // eventRender: $scope.eventRender
            }
        };

        function setEvents(events) {
            uiCalendarConfig.calendars['myCalendar'].fullCalendar('removeEvents');
            uiCalendarConfig.calendars['myCalendar'].fullCalendar('addEventSource', events);

        }
        /* event sources array*/











    });
