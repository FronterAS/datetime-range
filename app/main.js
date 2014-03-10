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
                //
            },
            template: '<input placeholder="date" ng-transclude/>'
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
                //
            },
            template: '<input placeholder="time" ng-transclude/>'
        };
    })
