'use strict';

angular.module('UIcomponents', [])
    .controller('MainCtrl', function ($scope) {
        var shouldHear = function (e, data) {
                console.info('Top controller heard ' + e.name);
            },

            rangePicker = angular.element('#datetimeRangePicker');

        $scope.onSubmit = function () {
            var postData = rangePicker.data('datetimeRange');
            console.log(postData);
        };

        // much topic, so callback, wow
        $scope.$on('allDayChange', shouldHear);
        $scope.$on('startDateChange', shouldHear);
        $scope.$on('endDateChange', shouldHear);
        $scope.$on('startTimeChange', shouldHear);
        $scope.$on('endTimeChange', shouldHear);
    });
