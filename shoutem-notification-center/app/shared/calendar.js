import _ from 'lodash';
import moment from 'moment';
import { DeviceInfo } from 'shoutem.application';

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return '';
  }

  const hourFormat24 = _.get(DeviceInfo, 'HOUR_FORMAT.H24');
  let format = 'MMM D • hh:mm A';

  if (hourFormat24 === DeviceInfo.getHourFormat()) {
    format = 'MMM D • HH:mm';
  }
  return moment(timestamp).format(format);
}
