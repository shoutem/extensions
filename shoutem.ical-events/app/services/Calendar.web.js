import { getTimeZone } from 'react-native-localize';
import momentTimezone from 'moment-timezone';
import { unavailableInWeb } from 'shoutem.application';

function toMoment(date) {
  return momentTimezone(date, 'YYYY-MM-DDThh:mm:ssZ');
}

export function addToCalendar() {
  return unavailableInWeb();
}

const DATE_FORMAT = 'MMM D • hh:mm A';
export function formatToLocalDate(date) {
  if (!date) {
    return '';
  }

  const localTimezone = getTimeZone();
  const momentDate = toMoment(date);

  return momentDate.tz(localTimezone).format(DATE_FORMAT);
}

export function formatToAllDayDate(startDate, endDate) {
  const isOneDayEvent = endDate.diff(startDate, 'days') === 1;

  if (isOneDayEvent) {
    return startDate.format('MMM D');
  }

  return `${startDate.format('MMM D - ')}${endDate.format('MMM D')}`;
}
