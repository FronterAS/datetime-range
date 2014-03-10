var app = angular.module('datetimepickerApp', [])
    .directive('datetimepickerwrapper', function () {
        return {
            scope: {},
            restrict: 'E',
            controller: function ($scope) {
                this.checkDates = function () {
                    $scope.something = 'pushed';
                    console.log('woop woop!');
                }
            }
        };
    })
    .directive('datetimepicker', function () {
        return {
            require: 'foo',
            template: '<button>{{something}}</button>',
            link: function (scope, element, attrs, wrapperCtrl) {
                element.on('click', function () {
                    wrapperCtrl.checkDates();
                });
            }
        };
    });
