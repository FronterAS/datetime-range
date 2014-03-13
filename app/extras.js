angular.module('UIcomponents')
    .service('DatetimeHelper', function () {
        return {
            /**
             * Wraps momentjs startOf('day')
             *
             * @param  {Date} date Can be any valid date that momentjs accepts.
             * @return {Date}      In ISOString format.
             */
            getStartOfDay: function (date) {
                return moment(date).startOf('day').toISOString();
            },

            /**
             * Wraps momentjs endOf('day')
             *
             * @param  {Date} date Can be any valid date that momentjs accepts.
             * @return {Date}      In ISOString format.
             */
            getEndOfDay: function (date) {
                return moment(date).endOf('day').toISOString();
            },

            /**
             * Updates the time on an ISOString date.
             *
             * @return {Date} ISOString format
             */
            updateTime: function (date, time) {
                var m = moment(date);

                m.hours(time.hour);
                m.minutes(time.mins);

                return m.toISOString();
            },

            getDate: function (formatString) {
                return moment().format(formatString);
            },

            getTime: function (formatString, hours, minutes) {
                var m = moment();


                formatString = formatString || 'HH:mm';

                if (hours !== undefined) {
                    m.add('hours', hours);
                }

                if (minutes !== undefined) {
                    m.add('minutes', minutes);
                }

                return m.format(formatString);
            }
        };
    })
    .factory('DatetimeRange', function (DatetimeHelper) {
        return function DatetimeRangeFactory() {
            var data = {
                    'startDate': null,
                    'endDate'  : null,
                    'allDay'   : false
                },

                toArray = function (date) {
                    return moment(date).toArray();
                },

                setStartDate = function (date) {
                    var parts = toArray(date);

                    // parts

                    console.info('changed start date to:');
                    console.info(date);
                    return this;
                },

                setEndDate = function (date) {
                    console.info('changed end date to:');
                    console.info(date);
                    return this;
                },

                setStartTime = function (time) {
                    console.info('changed start time to:');
                    console.info(time);
                    data.startDate = DatetimeHelper.updateTime(data.startDate, time);
                    return this;
                },

                setEndTime = function (time) {
                    console.info('changed end time to:');
                    console.info(time);
                    data.endDate = DatetimeHelper.updateTime(data.endDate, time);
                    return this;
                },

                /**
                 * Sets the all day flag and updates the date string to reflect an
                 * all day event.
                 *
                 * @todo What happens if something is not all day? Should we cache the previous
                 *       times and replace them into the date strings?
                 *
                 * @param {Boolean} isAllDay
                 */
                setAllDay = function (isAllDay) {
                    console.info('changed all day to:');
                    console.log(isChecked);

                    if (isAllDay) {
                        // startDate and endDate always exist
                        data.startDate = DatetimeHelper.getStartOfDay(data.startDate);
                        data.endDate = DatetimeHelper.getEndOfDay(data.startDate);
                    }
                };

            // API
            return {
                'setStartDate': setStartDate,
                'setEndDate': setEndDate,
                'setStartTime': setStartTime,
                'setEndTime': setEndTime,
                'setAllDay': setAllDay
            };
        };
    });
