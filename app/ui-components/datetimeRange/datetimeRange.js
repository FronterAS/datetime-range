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
                templateUrl: 'ui-components/datetimeRange/datetimeRange.html',
                restrict: 'E',
                priority: 10,
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
    );
