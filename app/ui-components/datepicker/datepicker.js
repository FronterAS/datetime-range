'use strict';

angular.module('ui-components')
    .directive(
        'datepicker',
        /**
         * Sets up an element as a datepicker.
         *
         * @return {object}
         */
        function datePickerDirective($timeout, DatetimeHelper) {
            return {
                templateUrl: 'ui-components/datepicker/datepicker.html',
                restrict: 'E',
                priority: 0,
                replace: true,
                scope: true,

                link: function (scope, element, attrs) {
                    console.info('linking datepicker');

                    scope.dateFormat = DatetimeHelper.adaptDateFormat(scope.dateFormat);

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
        function endDatePickerDirective(DatetimeHelper) {
            return {
                restrict: 'A',
                priority: 2,
                link: function (scope, element, attrs) {
                    var startDateCache;

                    console.info('linking endDate');

                    scope.$on('startDateChanged', function (e, startDate) {
                        var selectedDate = scope.api.get('select');


                        // Silently fail if selectedDate doesn't exist for some reason.
                        // A normal occurance will be that no date has been selected yet during
                        // the build phase of the component.
                        if (selectedDate) {
                            // If the startDate and endDate are the same, we assume that the
                            // user wants to change the endDate to match the start date.
                            if (DatetimeHelper.isSameDate(selectedDate, startDateCache) ||
                                // If the endDate is now earlier than the startDate we must update the
                                // endDate to match.
                                DatetimeHelper.isEarlierDate(selectedDate, startDate)
                                ) {
                                console.info('endDate was same as startDate, setting end date');
                                scope.api.set('select', startDate);
                            }

                            console.info('endDate heard startDateChanged, setting end date min to ');
                            console.log(startDate);
                            scope.api.set('min', startDate);
                        }

                        startDateCache = startDate;
                    });

                    scope.setupSetEvent('endDateChange');
                }
            };
        }
    );
