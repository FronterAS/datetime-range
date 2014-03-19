'use strict';

angular.module('ui-components')
    .service('DatetimeHelper', function DatetimeHelper() {
        var hasValue = function (str) {
                return str !== undefined && str !== null;
            };

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
                    m.seconds(0);
                    m.milliseconds(0);
                }

                return m.toISOString();
            },

            /**
             * @public
             * @param {formatString} formatString A valid date format string.
             */
            getDate: function (formatString) {
                formatString = formatString || 'YYYY-MM-DD';
                return moment().format(formatString);
            },

            /**
             * The pickadate library seems to require a lowercase format.
             * Since we will follow momentjs formatting, we are expecting a dateformat in uppercase.
             * We need to adapt date to work with the pickadate library.
             *
             * @param  {string} dateFormat The momentjs date format. i.e. YYYY-MM-DD
             * @return {string}            The lowercased date format
             */
            adaptDateFormat: function (dateFormat) {
                dateFormat = dateFormat.toLowerCase(dateFormat);
                return dateFormat;
            },

            /**
             * Facade function to determine if a pickadate date is the same as
             * a second supplied pickadate date.
             *
             * @param  {object}  dateA A pickadate object. Contains a 'pick' property.
             * @param  {object}  dateB A pickadate object. Contains a 'pick' property.
             * @return {boolean}
             */
            isSameDate: function (dateA, dateB) {
                return dateA.pick === dateB.pick;
            },

            /**
             * Facade function to determine if a pickadate date is earlier than
             * a second supplied pickadate date.
             *
             * @param  {object}  dateA A pickadate object. Contains a 'pick' property.
             * @param  {object}  dateB A pickadate object. Contains a 'pick' property.
             * @return {boolean}
             */
            isEarlierDate: function (dateA, dateB) {
                return dateA.pick < dateB.pick;
            },

            /**
             * @public
             * @param {string} formatString A valid time format string.
             *                              Defaults to 'HH:mm'
             * @param {number} hours Hours to offset by.
             * @param {number} minutes Minutes to offset by.
             */
            getTime: function (formatString, hours, minutes) {
                var m = moment();

                formatString = formatString || 'HH:mm';

                if (hasValue(hours)) {
                    m.add('hours', hours);
                }

                if (hasValue(minutes)) {
                    m.add('minutes', minutes);
                }

                return m.format(formatString);
            },

            /**
             * Accepts time in format HH:mm
             *
             * @todo Make this accept any time format
             * @param  {string} time Time string
             * @return {array}       Time as array.
             */
            timeToArray: function (time) {
                var parts = time.split(':');

                return [
                    parseInt(parts[0], 10),
                    parseInt(parts[1], 10)
                ];
            }
        };
    });
