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
                priority: 5,
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
    )
    // .directive(
    //     'startDate',
    //     /**
    //      * Handles behaviour specific to a start date in a range directive.
    //      *
    //      * @return {object}
    //      */
    //     function startDatePickerDirective() {
    //         return {
    //             restrict: 'A',
    //             priority: 3,
    //             link: function (scope, element, attrs) {
    //                 console.info('linking startDate');
    //                 scope.setupSetEvent('startDateChange');
    //             }
    //         };
    //     }
    // )
    // .directive(
    //     'endDate',
    //     /**
    //      * Handles behaviour specific to an end date in a range directive.
    //      *
    //      * @return {object}
    //      */
    //     function endDatePickerDirective() {
    //         return {
    //             restrict: 'A',
    //             priority: 2,
    //             link: function (scope, element, attrs) {
    //                 console.info('linking endDate');

    //                 scope.$on('startDateChanged', function (e, startDate) {
    //                     var selectedDate = scope.api.get('select');

    //                     console.info('endDate heard startDateChanged, setting end date min');

    //                     if (selectedDate && selectedDate.pick < startDate.pick) {
    //                         scope.api.set('select', startDate);
    //                     }
    //                 });

    //                 scope.setupSetEvent('endDateChange');
    //             }
    //         };
    //     }
    // );
