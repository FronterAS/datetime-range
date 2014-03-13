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
                console.info('changed all day to:');
                scope.allDay = isChecked;
                console.log(scope.allDay);

                // our ng-if badly needs to know about this
                scope.$apply();
            },

            onStartDateChange = function (e, date) {
                console.info('changed start date to:');
                console.info(date);
                scope.$broadcast('startDateChanged', date);
            },

            onEndDateChange = function (e, date) {
                console.info('changed end date to:');
                console.info(date);
                scope.$broadcast('endDateChanged', date);
            },

            onStartTimeChange = function (e, time) {
                console.info('changed start time to:');
                console.info(time);
            },

            onEndTimeChange = function (e, time) {
                console.info('changed end time to:');
                console.info(time);
            };

        return {
            restrict: 'E',
            scope: {
                dateFormat: '@',
                timeFormat: '@'
            },

            link: function (_scope_) {
                scope = _scope_;
                scope.now = new Date();

                // much topic, so callback, wow
                scope.$on('allDayChange', onAllDayChange);
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
                scope: true,
                link: function (scope, element, attrs) {
                    element.pickadate({
                        'format': scope.dateFormat
                    });
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
                    var api = element.pickadate('picker');

                    scope.$on('endDateChanged', function (e, date) {
                        console.info('heard end date change, updating start date');
                        console.info(date);
                        api.set('max', date);
                    });

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', scope.now);
                        }
                    }, 0);

                    element.on('change', function () {
                        scope.$emit('startDateChange', api.get('select'));
                    });
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
                    var api = element.pickadate('picker');

                    scope.$on('startDateChanged', function (e, date) {
                        console.info('heard start date change, updating end date');
                        console.info(date);
                        api.set('min', date);
                    });

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', scope.now);
                        }
                    }, 0);

                    element.on('change', function () {
                        scope.$emit('endDateChange', api.get('select'));
                    });
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
                scope: true,
                link: function (scope, element, attrs) {
                    element.pickatime({
                        format: scope.timeFormat
                    });
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
        function startTimePickerDirective($timeout) {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickatime('picker');

                    element.on('change', function () {
                        scope.$emit('startTimeChange', api.get('select'));
                    });

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', scope.now);
                        }
                    }, 0);
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
        function endTimePickerDirective($timeout) {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickatime('picker');

                    element.on('change', function () {
                        scope.$emit('endTimeChange', api.get('select'));
                    });

                    $timeout(function () {
                        // clone the date...
                        var inAnHour = scope.now;

                        inAnHour.setHours(inAnHour.getHours() + 1);

                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', inAnHour);
                        }
                    }, 0);
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
                scope: true, // create a child scope
                link: function (scope, element, attrs) {
                    // element is a checkbox
                    element.on('change', function () {
                        // We $emit the event up to the parent, so that the event
                        // can be detected if wanted on all parent controllers.
                        scope.$emit('allDayChange', element.is(':checked'));
                    });
                },
                templateUrl: 'allday.html'
            };
        }
    );
