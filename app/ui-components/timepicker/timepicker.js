'use strict';

angular.module('ui-components')
    .directive(
        'timepicker',
        /**
         * Sets up an element as a timepicker.
         *
         * @return {object}
         */
        function timePickerDirective($timeout, DatetimeHelper) {
            return {
                templateUrl: 'ui-components/timepicker/timepicker.html',
                restrict: 'E',
                priority: 3,
                replace: true,
                scope: true,

                link: function (scope, element, attrs) {
                    console.info('linking timepicker');

                    element.pickatime({
                        'format': scope.timeFormat.replace('mm', 'i'),
                        'clear': false,
                        'interval': 10,
                        'min': DatetimeHelper.timeToArray(scope.minTime),
                        'max': DatetimeHelper.timeToArray(scope.maxTime)
                    });

                    scope.setup = function (time) {
                        $timeout(function () {
                            if (!scope.api.get('select')) {
                                scope.api.set('select', time);
                            }
                        }, 100);
                    };

                    scope.api = element.pickatime('picker');

                    scope.$on('allDayChanged', function (e, isChecked) {
                        if (!isChecked) {
                            element.trigger('change');
                        }
                    });

                    scope.setupSetEvent = function (name) {
                        scope.api.on('set', function () {
                            scope.$emit(name, {
                                'data': scope.api.get('select'),
                                'value': scope.api.get('value')
                            });
                        });
                    };
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
                templateUrl: 'ui-components/timepicker/allday.html',
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
