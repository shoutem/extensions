import { uses24HourClock } from 'react-native-localize';
import moment from 'moment';
import { unavailableInWeb } from 'shoutem.application';

export function toMoment(date) {
  return moment(date, 'YYYY-MM-DDThh:mm:ssZ');
}

export function addToCalendar() {
  return unavailableInWeb();
}

export function formatDate(date) {
  if (!date) {
    return '';
  }

  const format = uses24HourClock() ? 'MMM D • HH:mm' : 'MMM D • hh:mm A';

  return toMoment(date).format(format);
}
