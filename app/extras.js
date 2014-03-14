'use strict';

angular.module('UIcomponents')
    .service('DatetimeHelper', function DatetimeHelper() {
        return {
            /**
             * Wraps momentjs startOf('day')
             *
             * @public
             * @param  {Date} date Can be any valid date that momentjs accepts.
             * @return {Date}      In ISOString format.
             */
            getStartOfDay: function (date) {
                return moment(date).startOf('day').toISOString();
            },

            /**
             * Wraps momentjs endOf('day')
             *
             * @public
             * @param  {string} date Can be any valid date that momentjs accepts.
             * @return {string}      In ISOString format.
             */
            getEndOfDay: function (date) {
                return moment(date).endOf('day').toISOString();
            },

            /**
             * Updates the time on any date that moment accepts.
             *
             * @public
             * @param {string} date Any date that moment accepts
             * @return {string} ISOString format
             */
            create: function (date, time) {
                var m = moment(date),
                    parts;

                if (time) {
                    parts = time.split(':');
                    m.hours(parseInt(parts[0], 10));
                    m.minutes(parseInt(parts[1], 10));
                }

                return m.toISOString();
            },

            /**
             * @public
             * @param {formatString} formatString A valid date format string.
             */
            getDate: function (formatString) {
                return moment().format(formatString);
            },

            /**
             * @public
             * @param {string} formatString A valid time format string.
             *                              Defaults to 'HH:mm'
             */
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
    .factory('DatetimeRange', function DatetimeRangeFactory(DatetimeHelper) {
        return function DatetimeRange() {
            var data = {
                    'startDate': null,
                    'endDate'  : null,
                    'allDay'   : false
                },

                startTimeCache,
                endTimeCache,

                /**
                 * Sets start or end date with ISOString.
                 *
                 * @param {string} key The data key to update. Can be 'start' or 'end'.
                 * @param {string} date Any date format that moment accepts.
                 * @param {object} time The time object from pickadate.
                 * @private
                 */
                setDateTime = function (key, date, time) {
                    var datetime = DatetimeHelper.create(date, time);

                    data[key + 'Date'] = datetime;
                    return this;
                },

                /**
                 * Convenience to ensure the time is set alongside the date.
                 *
                 * @public
                 */
                setStartDate = function (date) {
                    setDateTime('start', date, startTimeCache);

                    console.info('changed start date to:');
                    console.info(date);
                    return this;
                },

                /**
                 * Convenience to ensure the time is set alongside the date.
                 *
                 * @public
                 */
                setEndDate = function (date) {
                    setDateTime('end', date, endTimeCache);

                    console.info('changed end date to:');
                    console.info(date);
                    return this;
                },

                /**
                 * @public
                 */
                setStartTime = function (time) {
                    startTimeCache = time;
                    data.startDate = DatetimeHelper.create(data.startDate, time);

                    console.info('changed start time to:');
                    console.info(data.startDate);
                    return this;
                },

                /**
                 * @public
                 */
                setEndTime = function (time) {
                    endTimeCache = time;
                    data.endDate = DatetimeHelper.create(data.endDate, time);

                    console.info('changed end time to:');
                    console.info(data.endDate);
                    return this;
                },

                /**
                 * Sets the all day flag and updates the date string to reflect an
                 * all day event.
                 *
                 * @todo What happens if something is not all day? Should we cache the previous
                 *       times and replace them into the date strings?
                 *
                 * @public
                 * @param {Boolean} isAllDay
                 */
                setAllDay = function (isAllDay) {
                    console.info('changed all day to:');
                    console.log(isAllDay);

                    if (isAllDay) {
                        // startDate and endDate always exist
                        setDateTime('start', DatetimeHelper.getStartOfDay(data.startDate));
                        setDateTime('end', DatetimeHelper.getEndOfDay(data.startDate));
                    }
                },

                /**
                 * @public
                 */
                getData = function () {
                    return data;
                };

            // API
            return {
                'setStartDate': setStartDate,
                'setEndDate': setEndDate,
                'setStartTime': setStartTime,
                'setEndTime': setEndTime,
                'setAllDay': setAllDay,
                'getData': getData
            };
        };
    });
