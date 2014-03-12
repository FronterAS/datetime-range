angular.module('UIcomponents', [])
    .controller('MainCtrl', function ($scope) {
        var shouldNotHear = function () {
                console.error('Should not hear this');
            };

        $scope.$on('allday', shouldNotHear);
    })
    .directive('datetimepickerManager', function() {
        var onAllDayChange = function () {
                console.log('changed all day');
            },

            template = '<date-picker></date-picker>' +
                '<time-picker></time-picker>' +
                '<time-picker></time-picker>' +
                '<date-picker></date-picker>' +
                '<allday></allday>';

        return {
            restrict: 'E',
            scope: {},
            link: function (scope) {
                scope.$on('allday', onAllDayChange);
            },
            template: template
        };
    })
    .directive('datePicker', function() {
        var template = '<input ' +
                    'type="text" placeholder="Try me…" ' +
                    'readonly="" ' +
                    'aria-haspopup="true" ' +
                    'aria-expanded="false" ' +
                    'aria-readonly="false" />';

        return {
            /*require: '^datetimepickerManager',*/
            restrict: 'E',
            replace: true,
            scope: {},
            link: function (scope, element, attrs, datetimepickerCtrl) {
                element.on('change', function () {
                    console.log('changed date');
                });

                element.pickadate();
            },
            template: template

        };
    })
    .directive('timePicker', function() {
        var template = '<input type="time" />';

        return {
            /*require: '^datetimepickerManager',*/
            restrict: 'E',
            replace: true,
            scope: {},
            link: function (scope, element, attrs, datetimepickerCtrl) {
                element.on('change', function () {
                    console.log('changed time');
                });

                element.pickatime();
            },
            template: template
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
                    element.on('change', function () {
                        console.log('changed allday');
                        // We $broadcast on the parent, the manager, so that the event
                        // travels down the scopes and not up to the controller of the
                        // page, which $emit would do.
                        // Any interaction or event publishing on the controller should
                        // be taken care of by the manager.
                        scope.$parent.$broadcast('allday', element.is(':checked'));
                    });
                },
                template: '<input type="checkbox" />'
            };
        });


/**
 * Demo scripts http://codepen.io/amsul/pen/nGckA
 */
/*
var from_$input = $('#input_from').pickadate(),
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
})
 */

/*
http://stackoverflow.com/questions/21402756/angularjs-emit-only-works-within-its-current-scope
http://stackoverflow.com/questions/21501760/ng-transclude-in-directive-and-sending-events-to-parent
 */
