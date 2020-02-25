import _ from 'lodash';
import moment from 'moment';
import { uses24HourClock } from 'react-native-localize';

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return '';
  }

  const format = uses24HourClock() ? 'MMM D • HH:mm' : 'MMM D • hh:mm A';
  return moment(timestamp).format(format);
}
