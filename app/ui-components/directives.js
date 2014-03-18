'use strict';

/**
 * @required datePicker, timePicker
 */
angular.module('ui-components')
    .directive(
        'datetimeRange',
        function datetimeRangeDirective(DatetimeRange) {
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
                    datetimeRange.setStartDate(date.value);
                    updateData();

                    scope.$broadcast('startDateChanged', date.data);
                },

                onEndDateChange = function (e, date) {
                    datetimeRange.setEndDate(date.value);
                    updateData();

                    scope.$broadcast('endDateChanged', date.data);
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
                templateUrl: 'datetimeRange.html',
                restrict: 'E',
                scope: {
                    dateFormat: '@',
                    timeFormat: '@',
                    minTime: '@',
                    maxTime: '@'
                },

                link: function (_scope_, _element_, attrs) {
                    console.info('linking datetimeRange');

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
                }
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
        function startDatePickerDirective() {
            return {
                restrict: 'A',
                priority: 1,
                link: function (scope, element, attrs) {
                    console.info('linking startDate');
                    scope.setupSetEvent('startDateChange');
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
        function endDatePickerDirective() {
            return {
                restrict: 'A',
                priority: 2,
                link: function (scope, element, attrs) {
                    console.info('linking endDate');

                    scope.$on('startDateChanged', function (e, startDate) {
                        var selectedDate = scope.api.get('select');

                        console.info('endDate heard startDateChanged, setting end date min');

                        if (selectedDate && selectedDate.pick < startDate.pick) {
                            scope.api.set('select', startDate);
                        }
                    });

                    scope.setupSetEvent('endDateChange');
                }
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
        function startTimePickerDirective(DatetimeHelper) {
            return {
                restrict: 'A',
                priority: 4,

                link: function (scope, element, attrs) {
                    console.info('linking startTime');

                    scope.setupSetEvent('startTimeChange');
                    scope.setup(DatetimeHelper.getTime(scope.timeFormat));
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
        function endTimePickerDirective(DatetimeHelper) {
            return {
                restrict: 'A',
                priority: 5,
                link: function (scope, element, attrs) {
                    console.info('linking endTime');

                    var setMinTime = function (e, startTime) {
                        var min = false,
                            selectedTime = scope.api.get('select');

                        if (scope.isSameDay()) {
                            if (selectedTime && startTime.pick > selectedTime.pick) {
                                scope.api.set('selected', startTime);
                            }
                        }
                    };

                    // setup events first
                    scope.$on('startTimeChanged', setMinTime);
                    scope.setupSetEvent('endTimeChange');

                    // then update your directive stuff!
                    scope.setup(DatetimeHelper.getTime(scope.timeFormat, 1));
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
                templateUrl: 'allday.html',
                restrict: 'E',
                replace: true,
                scope: true,

                link: function (scope, element, attrs) {
                    console.info('linking allday');

                    // element is a checkbox
                    element.on('change', function () {
                        // We $emit the event up to the parent, so that the event
                        // can be detected if wanted on all parent controllers.
                        scope.$emit('allDayChange', element.is(':checked'));
                    });
                }
            };
        }
    );
