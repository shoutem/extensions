import { uses24HourClock } from 'react-native-localize';
import moment from 'moment';

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return '';
  }

  const format = uses24HourClock() ? 'MMM D • HH:mm' : 'MMM D • hh:mm A';
  return moment(timestamp).format(format);
}

export function parseTimeToTimeObject(dateTime) {
  return {
    hours: moment(dateTime).hours(),
    minutes: moment(dateTime).minutes(),
  };
}
