'use strict';

angular.module('ui-components')
    .directive(
        'datePicker',
        /**
         * Sets up an element as a datepicker.
         *
         * @return {object}
         */
        function datePickerDirective($timeout, DatetimeHelper) {
            return {
                templateUrl: 'datepicker.html',
                restrict: 'E',
                priority: 0,
                replace: true,
                scope: true,

                link: function (scope, element, attrs) {
                    console.info('linking datepicker');

                    element.pickadate({
                        'format': scope.dateFormat,
                        'formatSubmit': scope.dateFormat,
                        'selectMonths': true,
                        'selectYears': true,
                        'clear': false
                    });

                    scope.api = element.pickadate('picker');

                    scope.setupSetEvent = function (name) {
                        scope.api.on('set', function () {
                            scope.$emit(name, {
                                'value': scope.api.get('value'),
                                'data': scope.api.get('select')
                            });
                        });
                    };

                    $timeout(function () {
                        if (!scope.api.get('select')) {
                            scope.api.set(
                                'select',
                                DatetimeHelper.getDate(scope.dateFormat)
                            );
                        }
                    }, 100);
                }
            };
        }
    );
