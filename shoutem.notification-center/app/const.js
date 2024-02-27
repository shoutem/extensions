// This file is auto-generated.
import moment from 'moment';
import PropTypes from 'prop-types';
import { getAppId } from 'shoutem.application';
import pack from './package.json';

export const NOTIFICATIONS_MODULE_NAME = 'pushNotifications';
export const NOTIFICATIONS_RESOURCE = 'shoutem.core.push-notifications';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const GROUP_PREFIX = 'group.';
// Don't use extension name inside channel_id strings. It contains 'shoutem' and channel names are
// visible in Android app specific notification settings
export const REMINDER_CHANNEL_ID = `${getAppId()}.reminder`;
export const SCHEDULED_NOTIFICATIONS_CHANNEL_ID = `${getAppId()}.user_scheduled_notifications`;
export const JOURNEY_NOTIFICATIONS_CHANNEL_ID = `${getAppId()}.journey_local_notifications`;

export const REPEAT_CONFIG = {
  repeatTime: 1,
  repeatType: 'day',
};

export const DEFAULT_TIMEFRAME = {
  beginsAt: moment()
    .set({ h: 8, m: 0 })
    .format(),
  endsAt: moment()
    .set({ h: 22, m: 0 })
    .format(),
};
export const DEFAULT_REMINDER = moment()
  .set({ h: 8, m: 0 })
  .format();

export const notificationShape = PropTypes.shape({
  // Notification ID
  id: PropTypes.number.isRequired,
  // URL to image
  imageUrl: PropTypes.string.isRequired,
  // Summary text
  summary: PropTypes.string.isRequired,
  // Time when the notification was created
  timestamp: PropTypes.number.isRequired,
  // Was the notification read
  read: PropTypes.bool,
});

export const pushGroupShape = PropTypes.shape({
  // Group ID
  id: PropTypes.number,
  // Image URL for the groups's thumbnail
  imageUrl: PropTypes.string,
  // Group name
  name: PropTypes.string,
  // True if the group should be subscribed to on app launch, false otherwise
  subscribeByDefault: PropTypes.bool,
  // Group tag, used for subscribtions
  tag: PropTypes.string,
});

export const PUSH_NOTIFICATION_TYPE_OPTIONS = {
  SEND_NOW: 'Send now',
  SCHEDULED: 'Scheduled',
};

export const PUSH_NOTIFICATIONS_TARGET_OPTIONS = {
  APP: 'App',
  URL: 'Url',
  SCREEN: 'Screen',
};

export const PUSH_NOTIFICATION_AUDIENCE_TYPES = {
  BROADCAST: 'broadcast',
  GROUP: 'group',
};

export const PUSH_NOTIFICATION_GROUP_TYPES = {
  USER: 'user',
  GROUP: 'group',
  BROADCAST: 'broadcast',
};
