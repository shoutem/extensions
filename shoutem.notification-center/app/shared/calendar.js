import _ from 'lodash';
import moment from 'moment';
import { DeviceInfo } from 'shoutem.application';

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return '';
  }

  const format = DeviceInfo.is24Hour() ? 'MMM D • HH:mm' : 'MMM D • hh:mm A';
  return moment(timestamp).format(format);
}
