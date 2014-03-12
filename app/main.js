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
    .directive('datetimeRange', function() {
        var startDateValue,
            endDateValue,
            startTimeValue,
            endTimeValue,

            onAllDayChange = function (e, data) {
                console.log('changed all day');
            },

            onStartDateChange = function (date) {
                console.log('changed start date');
            },

            onEndDateChange = function (date) {
                console.log('changed end date');
            },

            onStartTimeChange = function (date) {
                console.log('changed start time');
            },

            onEndTimeChange = function (date) {
                console.log('changed end time');
            },

            onDateChange = function (e, data) {
                console.log('changed date');
            },

            onTimeChange = function (e, data) {
                console.log('changed time');
            };

        /*var from_$input = $('#input_from').pickadate(),
            from_picker = from_$input.pickadate('picker')

        var to_$input = $('#input_to').pickadate(),
            to_picker = to_$input.pickadate('picker')


        // Check if there’s a “from” or “to” date to start with.
        if ( from_picker.get('value') ) {
          to_picker.set('min', from_picker.get('select'))
        }
        if ( to_picker.get('value') ) {
          from_picker.set('max', to_picker.get('select'))
        }

        // When something is selected, update the “from” and “to” limits.
        from_picker.on('set', function(event) {
          if ( event.select ) {
            to_picker.set('min', from_picker.get('select'))
          }
        })
        to_picker.on('set', function(event) {
          if ( event.select ) {
            from_picker.set('max', to_picker.get('select'))
          }
        })*/

        return {
            restrict: 'E',
            scope: {},
            link: function (scope) {
                scope.$on('allday', onAllDayChange);
                scope.$on('dateChange', onDateChange);
            },
            templateUrl: 'datetimeRange.html'
        };
    })
    .directive('datePicker', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: function (scope, element, attrs, datetimepickerCtrl) {
                var api;

                element.on('change', function () {
                    scope.$parent.$broadcast('dateChange');
                });

                element.pickadate();
                api = element.pickadate('picker');

                scope.$on('startDateChanged', function (e, data) {
                    console.log('start date changed');
                    console.log(data);
                    // api.set('max', data);
                });
            },
            templateUrl: 'datepicker.html'

        };
    })
    .directive('timePicker', function timepickerDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: function (scope, element, attrs, datetimepickerCtrl) {
                element.on('change', function () {
                    console.log('changed time');
                });

                element.pickatime();
            },
            templateUrl: 'timepicker.html'
        };
    })
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
                scope: {}, // create an isolate scope
                link: function (scope, element, attrs, ctrl) {
                    // element is a checkbox
                    element.on('change', function () {
                        // We $broadcast on the parent, so that the event
                        // travels down the scopes and not up to the controller of the
                        // page, which $emit would do.
                        // Any interaction or event publishing on the controller should
                        // be taken care of by the manager.
                        scope.$parent.$broadcast('allday', element.is(':checked'));
                    });
                },
                templateUrl: 'allday.html'
            };
        });
