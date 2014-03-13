/*
Thanks to amsul for pickadate and his demo scripts at http://codepen.io/collection/vLcih/
Also these 2 conversations on stack overflow allowed me to understand just how I'd managed to waste almost an entire night chasing the dream of a shared scope between parent and child directives.
http://stackoverflow.com/questions/21402756/angularjs-emit-only-works-within-its-current-scope
http://stackoverflow.com/questions/21501760/ng-transclude-in-directive-and-sending-events-to-parent
 */
angular.module('UIcomponents', [])
    .controller('MainCtrl', function ($scope) {
        var shouldNotHear = function () {
                console.error('Should not hear this');
            };

        $scope.$on('allday', shouldNotHear);
    })
    .directive('datetimeRange', function datetimeRangeDirective($timeout) {
        var scope,

            onAllDayChange = function (e, isChecked) {
                console.log('changed all day');
                scope.allDay = allDayValue = isChecked;
            },

            onStartDateChange = function (e, date) {
                console.log('changed start date to:');
                console.log(date);
                scope.$emit('startDateChanged', date);
            },

            onEndDateChange = function (e, date) {
                console.log('changed end date to:');
                console.log(date);
                scope.$emit('endDateChanged', date);
            },

            onStartTimeChange = function (e, time) {
                console.log('changed start time date to:');
                console.log(time);
            },

            onEndTimeChange = function (e, time) {
                console.log('changed end time date to:');
                console.log(time);
            };

        return {
            restrict: 'E',
            scope: {},
            link: function (_scope_) {
                scope = _scope_;
                scope.$on('alldayChange', onAllDayChange);
                scope.$on('startDateChange', onStartDateChange);
                scope.$on('endDateChange', onEndDateChange);
                scope.$on('startTimeChange', onStartTimeChange);
                scope.$on('endTimeChange', onEndTimeChange);
            },
            templateUrl: 'datetimeRange.html'
        };
    })
    .directive(
        'datePicker',
        /**
         * Sets up an element as a datepicker.
         *
         * @return {object}
         */
        function datePickerDirective() {
            return {
                restrict: 'E',
                priority: 0,
                replace: true,
                scope: {},
                link: function (scope, element, attrs) {
                    element.pickadate();
                },
                templateUrl: 'datepicker.html'
            };
        }
    )
    .directive(
        'startDate',
        /**
         * Handles behaviour specific to a start date in a range directive.
         *
         * @return {object}
         */
        function startDatePickerDirective($timeout) {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickadate('picker'),
                        broadcast = function () {
                            scope.$parent.$broadcast('startDateChange', api.get('select'));
                        };

                    scope.$on('endDateChanged', function (e, date) {
                        console.log('heard end date change, updating start date');
                        console.log(date);
                        api.set('max', date);
                    });

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', new Date());
                        }
                    }, 0);

                    element.on('change', broadcast);
                }
            };
        }
    )
    .directive(
        'endDate',
        /**
         * Handles behaviour specific to an end date in a range directive.
         *
         * @return {object}
         */
        function endDatePickerDirective($timeout) {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickadate('picker'),
                        broadcast = function () {
                            scope.$parent.$broadcast('endDateChange', api.get('select'));
                        };

                    scope.$on('startDateChanged', function (e, date) {
                        console.log('heard start date change, updating end date');
                        console.log(date);
                        api.set('min', date);
                    });

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', new Date());
                        }
                    }, 0);

                    element.on('change', broadcast);
                }
            };
        }
    )
    .directive(
        'timePicker',
        /**
         * Sets up an element as a timepicker.
         *
         * @return {object}
         */
        function timePickerDirective() {
            return {
                restrict: 'E',
                priority: 0,
                replace: true,
                scope: {},
                link: function (scope, element, attrs) {
                    element.pickatime();
                },
                templateUrl: 'timepicker.html'
            };
        }
    )
    .directive(
        'startTime',
        /**
         * Handles behaviour specific to an start time in a range directive.
         *
         * @return {object}
         */
        function startTimePickerDirective() {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickatime('picker');

                    element.on('change', function () {
                        scope.$parent.$broadcast('startTimeChange', api.get('select'));
                    });

                    scope.$on('endTimeChanged', function (e, data) {
                        console.log('heard end time change, updating start time');
                        console.log(data);
                        // api.set('max', data);
                    });
                }
            };
        }
    )
    .directive(
        'endTime',
        /**
         * Handles behaviour specific to an end time in a range directive.
         *
         * @return {object}
         */
        function endTimePickerDirective() {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickatime('picker');

                    element.on('change', function () {
                        scope.$parent.$broadcast('endTimeChange');
                    });

                    scope.$on('startTimeChanged', function (e, data) {
                        console.log('heard start time change, updating end time');
                        console.log(data);
                        // api.set('max', data);
                    });
                }
            };
        }
    )
    .directive(
        'allday',
        /**
         * This directive shares the scope of the parent directive.
         * @return {function} [description]
         */
        function allDayDirective() {
            return {
                restrict: 'E',
                replace: true,
                scope: {}, // create an isolate scope
                link: function (scope, element, attrs) {
                    // element is a checkbox
                    element.on('change', function () {
                        // We $broadcast on the parent, so that the event
                        // travels down the scopes and not up to the controller of the
                        // page, which $emit would do.
                        // Any interaction or event publishing on the controller should
                        // be taken care of by the manager.
                        scope.$parent.$broadcast('alldayChange', element.is(':checked'));
                    });
                },
                templateUrl: 'allday.html'
            };
        }
    );
