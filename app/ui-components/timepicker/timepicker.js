'use strict';

angular.module('ui-components')
    .directive(
        'timePicker',
        /**
         * Sets up an element as a timepicker.
         *
         * @return {object}
         */
        function timePickerDirective($timeout, DatetimeHelper) {
            return {
                templateUrl: 'timepicker.html',
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
    );
