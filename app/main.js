/*
Thanks to amsul for pickadate and his demo scripts at http://codepen.io/collection/vLcih/
Also these 2 conversations on stack overflow allowed me to understand just how I'd managed to waste almost an entire night chasing the dream of a shared scope between parent and child directives.
http://stackoverflow.com/questions/21402756/angularjs-emit-only-works-within-its-current-scope
http://stackoverflow.com/questions/21501760/ng-transclude-in-directive-and-sending-events-to-parent
 */
angular.module('UIcomponents', [])
    .controller('MainCtrl', function ($scope) {
        var shouldHear = function (e, data) {
                console.info('Top controller heard ' + e.name);
            },

            rangePicker = angular.element('#datetimeRangePicker');

        $scope.onSubmit = function () {
            var postData = rangePicker.data('datetimeRange');
            console.log(postData);
        };

        // much topic, so callback, wow
        $scope.$on('allDayChange', shouldHear);
        $scope.$on('startDateChange', shouldHear);
        $scope.$on('endDateChange', shouldHear);
        $scope.$on('startTimeChange', shouldHear);
        $scope.$on('endTimeChange', shouldHear);
    })
    .directive('datetimeRange', function datetimeRangeDirective($timeout) {
        var scope,
            element,

            datetimeRange = {
                'startTime': null,
                'endTime': null,
                'startDate': null,
                'endDate': null,
                'allDay': false
            },

            updateData = function (key, value) {
                if (value === null) {
                    delete datetimeRange[key];

                } else {
                    datetimeRange[key] = value;
                }

                element.data('datetimeRange', datetimeRange);
            },

            onAllDayChange = function (e, isChecked) {
                console.info('changed all day to:');
                scope.allDay = isChecked;
                console.log(scope.allDay);

                updateData('allDay', scope.allDay);

                if (scope.allDay) {
                    updateData('startTime', null);
                    updateData('endTime', null);
                }

                scope.$broadcast('allDayChanged', scope.allDay);

                // our ng-if badly needs to know about this
                scope.$apply();
            },

            onStartDateChange = function (e, date) {
                console.info('changed start date to:');
                console.info(date);
                updateData('startDate', date);
                scope.$broadcast('startDateChanged', date);
            },

            onEndDateChange = function (e, date) {
                console.info('changed end date to:');
                console.info(date);
                updateData('endDate', date);
                scope.$broadcast('endDateChanged', date);
            },

            onStartTimeChange = function (e, time) {
                console.info('changed start time to:');
                console.info(time);
                updateData('startTime', time);
            },

            onEndTimeChange = function (e, time) {
                console.info('changed end time to:');
                console.info(time);
                updateData('endTime', time);
            };

        return {
            restrict: 'E',
            scope: {
                dateFormat: '@',
                timeFormat: '@'
            },

            link: function (_scope_, _element_) {
                scope = _scope_;
                element = _element_;

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
                        'format': scope.dateFormat,
                        'formatSubmit': scope.dateFormat
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
                        scope.$emit('startDateChange', api.get('value'));
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
                        scope.$emit('endDateChange', api.get('value'));
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

                    scope.$on('allDayChanged', function (e, isChecked) {
                        if (!isChecked) {
                            element.trigger('change');
                        }
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

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', scope.now);
                        }
                    }, 0);

                    element.on('change', function () {
                        scope.$emit('startTimeChange', api.get('value'));
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
        function endTimePickerDirective($timeout) {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickatime('picker');

                    $timeout(function () {
                        // clone the date...
                        var inAnHour = scope.now;

                        inAnHour.setHours(inAnHour.getHours() + 1);

                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', inAnHour);
                        }
                    }, 0);

                    element.on('change', function () {
                        scope.$emit('endTimeChange', api.get('value'));
                    });
                }
            };
        }
    )
    .directive(
        'allday',
        /**
         * This directive shares the scope of the parent directive.
         * @return {object}
         */
        function allDayDirective() {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
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
