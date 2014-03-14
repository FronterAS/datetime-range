'use strict';

angular.module('UIcomponents')
    .directive(
        'datetimeRange',
        function datetimeRangeDirective($timeout, DatetimeRange) {
            var scope,
                element,

                datetimeRange = new DatetimeRange(),

                updateData = function () {
                    var data = datetimeRange.getData();

                    element.data('datetimeRange', data);
                    console.log(data);
                },

                onAllDayChange = function (e, isChecked) {
                    // We are using allDay to hide and show the time directives.
                    scope.allDay = isChecked;

                    datetimeRange.setAllDay(scope.allDay);
                    updateData();

                    // Let the children know
                    scope.$broadcast('allDayChanged', scope.allDay);


                    // our ng-if badly needs to know about this
                    scope.$apply();
                },

                onStartDateChange = function (e, date) {
                    datetimeRange.setStartDate(date);
                    updateData();

                    scope.$broadcast('startDateChanged', date);
                },

                onEndDateChange = function (e, date) {
                    datetimeRange.setEndDate(date);
                    updateData();

                    scope.$broadcast('endDateChanged', date);
                },

                onStartTimeChange = function (e, time) {
                    datetimeRange.setStartTime(time.value);
                    updateData();

                    scope.$broadcast('startTimeChanged', time.data);
                },

                onEndTimeChange = function (e, time) {
                    datetimeRange.setEndTime(time.value);
                    updateData();

                    scope.$broadcast('endTimeChanged', time.data);
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

                    // We need this function in the other directives
                    scope.isSameDay = datetimeRange.isSameDay;

                    // much topic, so callback, wow
                    scope.$on('allDayChange', onAllDayChange);
                    scope.$on('startDateChange', onStartDateChange);
                    scope.$on('endDateChange', onEndDateChange);
                    scope.$on('startTimeChange', onStartTimeChange);
                    scope.$on('endTimeChange', onEndTimeChange);
                },
                templateUrl: 'datetimeRange.html'
            };
        }
    )
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
        function startDatePickerDirective($timeout, DatetimeHelper) {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    var api = element.pickadate('picker');

                    scope.$on('endDateChanged', function (e, date) {
                        console.info('heard end date change, updating start date max');
                        console.info(date);
                        api.set('max', date, { format: scope.dateFormat });
                    });

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', DatetimeHelper.getDate(scope.dateFormat));
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
        function endDatePickerDirective($timeout, DatetimeHelper) {
            return {
                restrict: 'A',
                priority: 2,
                link: function (scope, element, attrs) {
                    var api = element.pickadate('picker');

                    scope.$on('startDateChanged', function (e, date) {
                        console.info('heard start date change, updating end date min');
                        console.info(date);
                        api.set('min', date, { format: scope.dateFormat });
                    });

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', DatetimeHelper.getDate(scope.dateFormat));
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
                priority: 3,
                replace: true,
                scope: true,
                link: function (scope, element, attrs) {
                    element.pickatime({
                        format: scope.timeFormat.replace('mm', 'i')
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
        function startTimePickerDirective($timeout, DatetimeHelper) {
            return {
                restrict: 'A',
                priority: 4,
                link: function (scope, element, attrs) {
                    var api = element.pickatime('picker');

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', DatetimeHelper.getTime(scope.timeFormat));
                        }
                    }, 0);

                    scope.$on('endTimeChanged', function (e, time) {
                        if (scope.isSameDay()) {
                            api.set('max', time);
                        }
                    });

                    element.on('change', function () {
                        scope.$emit('startTimeChange', {
                            'data': api.get('select'),
                            'value': api.get('value')
                        });
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
        function endTimePickerDirective($timeout, DatetimeHelper) {
            return {
                restrict: 'A',
                priority: 5,
                link: function (scope, element, attrs) {
                    var api = element.pickatime('picker');

                    $timeout(function () {
                        // this will throw a change event
                        if (!api.get('select')) {
                            api.set('select', DatetimeHelper.getTime(scope.timeFormat, 1));
                        }
                    }, 0);

                    scope.$on('startTimeChanged', function (e, time) {
                        if (scope.isSameDay()) {
                            api.set('min', time);
                        }
                    });

                    element.on('change', function () {
                        scope.$emit('endTimeChange', {
                            'data': api.get('select'),
                            'value': api.get('value')
                        });
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