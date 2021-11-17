import _ from 'lodash';
import moment from 'moment-timezone';
import timezones from 'timezones.json';

export const DEFAULT_TIMEZONE_ID = 'UTC';
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

function getTimezoneName(timezoneId) {
  const timezone = _.find(timezones, { value: timezoneId });
  return _.head(timezone.utc);
}

function getDateWithTimezone(date, timezone) {
  if (!timezone) {
    return moment(date);
  }

  const timezoneName = getTimezoneName(timezone);
  return moment(date).tz(timezoneName);
}

function dateToUTC(date, timezone) {
  const timezoneDate = getDateWithTimezone(date, timezone);
  return timezoneDate.clone().tz(DEFAULT_TIMEZONE_ID);
}

export function dateToString(date, timezone = DEFAULT_TIMEZONE_ID) {
  const utcDate = dateToUTC(date, timezone);
  return utcDate.format(DATE_TIME_FORMAT);
}
