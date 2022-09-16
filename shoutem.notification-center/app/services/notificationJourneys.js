import _ from 'lodash';
import moment from 'moment';
import { JOURNEY_NOTIFICATIONS_CHANNEL_ID } from '../const';
import notificationService from './notifications';

function createNotificationId(stringifiedId) {
  if (!stringifiedId) {
    return null;
  }

  const signedHash = _.reduce(stringifiedId, (result, _char, index) => {
    const char = stringifiedId.charCodeAt(index);
    let hash = ((result << 5) - result) + char;

    // convert to 32Bit int
    hash |= 0;

    return hash;
  });

  // make sure the signed Int is positive
  return Math.abs(signedHash)
}

function calculateEndsAt(journey) {
  const notificationsPerDelay = _.sortBy(journey.notifications, ['delay']);
  const maxDelayNotification = _.last(notificationsPerDelay);

  return moment()
    .add(maxDelayNotification.delay, 'minutes')
    .format();
}

/**
 * Check if estimatedEndsAt time has passed.
 * If true, we can assume all journey notifications have been delivered,
 * and journey is no longer active for that user.
 * @param {object} journey
 */
function isJourneyActive(journey) {
  const timeDiff = moment().diff(moment(journey.estimatedEndsAt));

  return timeDiff < 0;
}

function scheduleNotifications(triggerId, notifications, payload) {
  return notifications.forEach((notification, index) => {
    const notificationId = createNotificationId(`${triggerId}-${index.toString()}`);

    return notificationService.scheduleLocalNotifications(
      { ...notification, channelId: JOURNEY_NOTIFICATIONS_CHANNEL_ID },
      {
        triggerId,
        // adding index to the ID as the datestamp can be same
        // in case of fast execution
        notificationId,
        // adding basic info to custom payload, so it can be consumes
        // by regular push notification consumers that know how
        // to open screen / url
        ...(notification.action && { action: notification.action }),
        ...(notification.body && { body: notification.body }),
        ...(notification.title && { title: notification.title }),
        ...payload,
      },
    );
  });
}

export default {
  calculateEndsAt,
  isJourneyActive,
  scheduleNotifications,
};
