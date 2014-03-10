angular.module('datepickerApp', [])
    .directive('datetimepickerManager', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {},
            controller: function ($scope) {
                //
            },
            template: '<div ng-transclude></div>'
        };
    })
    .directive('datepicker', function() {
        return {
            require: '^datetimepickerManager',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            link: function (scope, element, attrs, datetimepickerCtrl) {
                element.on('change', function () {
                    console.log('changed date');
                });
            },
            template: '<input type="date" ng-transclude/>'
        };
    })
    .directive('timepicker', function() {
        return {
            require: '^datetimepickerManager',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            link: function (scope, element, attrs, datetimepickerCtrl) {
                element.on('change', function () {
                    console.log('changed time');
                });
            },
            template: '<input type="time" ng-transclude/>'
        };
    })
    .directive('allday', function() {
        return {
            require: '^datetimepickerManager',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            link: function (scope, element, attrs, datetimepickerCtrl) {
                element.on('change', function () {
                    console.log('changed allday');
                });
            },
            template: '<input type="checkbox" ng-transclude/>'
        };
    })
