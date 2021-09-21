import _ from 'lodash';
import moment from 'moment';
import PushNotifications from 'react-native-push-notification';
import { Firebase } from 'shoutem.firebase';
import {
  REMINDER_CHANNEL_ID,
  REMINDER_NOTIFICATION_ID,
  REPEAT_CONFIG,
  SCHEDULED_NOTIFICATIONS_CHANNEL_ID,
} from '../const';
import { parseTimeToTimeObject } from '../services';
import { Platform } from 'react-native';

let chimeSoundName = '';

function setChimeSoundName(soundName) {
  chimeSoundName = soundName;
}

function scheduleRepeatingNotifications(message, date) {
  if (Platform.OS === 'ios') {
    const config = {
      id: REMINDER_NOTIFICATION_ID,
      fireDate: date,
      body: message,
      title: '',
      repeats: true,
      sound: chimeSoundName || 'default',
    };

    return Firebase.scheduleLocalNotificationIos(config);
  }

  const config = {
    allowWhileIdle: true, // (optional) set notification to work while on doze, default: false,
    channelId: REMINDER_CHANNEL_ID, // android only
    id: REMINDER_NOTIFICATION_ID, // has to be stringified integer
    date,
    message,
    soundName: chimeSoundName || 'default',
    title: '',
    ...REPEAT_CONFIG,
  };

  return Firebase.scheduleLocalNotification(config);
}

function cancelReminderNotifications() {
  return new Promise(resolve => {
    PushNotifications.getScheduledLocalNotifications(
      async scheduledLocalNotifications => {
        const scheduledReminderNotification = _.find(
          scheduledLocalNotifications,
          { id: REMINDER_NOTIFICATION_ID },
        );

        if (!!scheduledReminderNotification) {
          await PushNotifications.cancelLocalNotifications({
            id: scheduledReminderNotification.id,
          });
        }

        resolve();
      },
    );
  });
}

async function scheduleReminderNotifications(message, reminderTime) {
  const reminderAtTimeObject = parseTimeToTimeObject(reminderTime);
  const now = moment();
  let date = moment()
    .set({
      hours: reminderAtTimeObject.hours,
      minutes: reminderAtTimeObject.minutes,
      seconds: 0,
    })
    .toDate();

  // if user selected time is past, iOS won't schedule notification
  if (moment(date).isBefore(now)) {
    date = moment(date)
      .add(1, 'days')
      .toDate();
  }

  await cancelReminderNotifications();
  await scheduleRepeatingNotifications(message, date);
}

function cancelScheduledNotifications(reminderTime) {
  PushNotifications.getScheduledLocalNotifications(
    async scheduledLocalNotifications => {
      const scheduledReminderNotification = _.find(
        scheduledLocalNotifications,
        { id: REMINDER_NOTIFICATION_ID },
      );

      // Cancel all, then reschedule daily reminder notification
      // Faster than filtering & canceling 1 by 1 daily notifications
      PushNotifications.cancelAllLocalNotifications();

      if (!!scheduledReminderNotification) {
        await scheduleReminderNotifications(
          scheduledReminderNotification.message,
          reminderTime,
        );
      }
    },
  );
}

function randomizeTime(dailyMessagesSettings) {
  const { beginsAt, endsAt } = dailyMessagesSettings;

  const now = new Date().getTime();
  // Getting beginsAt value of today so we can reschedule the notification
  // for same time tomorrow, if today's beginsAt has passed
  const todayBeginsAt = moment().set({
    h: moment(beginsAt).hour(),
    m: moment(beginsAt).minutes(),
    s: 0,
  });
  const todayEndsAt = moment().set({
    h: moment(endsAt).hour(),
    m: moment(endsAt).minutes(),
    s: 0,
  });
  const beginsAtMiliseconds = moment(todayBeginsAt)
    .toDate()
    .getTime();
  const endsAtMiliseconds = moment(todayEndsAt)
    .toDate()
    .getTime();

  // Randomizes time between beginsAtMiliseconds & endsAtMiliseconds
  const randomTime = Math.floor(
    Math.random() * (endsAtMiliseconds - beginsAtMiliseconds) +
      beginsAtMiliseconds,
  );

  if (randomTime < now) {
    // If timeframe has passed, schedule it for tomorrow, same time
    return moment(randomTime)
      .add(1, 'days')
      .toDate();
  }

  return moment(randomTime).toDate();
}

function shuffleMessagesArray(messages) {
  for (let i = 0; i < messages.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = messages[i];
    messages[i] = messages[j];
    messages[j] = temp;
  }

  return messages;
}

function randomizeNotifications(notification, dailyMessagesSettings) {
  const messages = notification.actions;
  const shuffledMessages = shuffleMessagesArray(messages);
  const randomMessages = shuffledMessages.splice(
    0,
    parseInt(notification.numberOfMessages),
  );

  return _.map(randomMessages, randomMessage => {
    const date = randomizeTime(dailyMessagesSettings);
    const message = randomMessage.message;

    return {
      date,
      message,
    };
  });
}

function randomlyScheduleXnotifications(notification, notificationSettings) {
  // Randomizes {notification.numberOfMessages} messages & randomly schedules each inside
  // selected time interval for daily messages
  const randomizedNotifications = randomizeNotifications(
    notification,
    notificationSettings.dailyMessagesSettings,
  );

  _.forEach(randomizedNotifications, randomizedNotification => {
    const config = {
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      channelId: SCHEDULED_NOTIFICATIONS_CHANNEL_ID, // android only
      date: randomizedNotification.date,
      message: randomizedNotification.message,
      soundName: chimeSoundName || 'default',
      title: notification.title,
    };

    Firebase.scheduleLocalNotification(config);
  });
}

export default {
  cancelReminderNotifications,
  cancelScheduledNotifications,
  randomizeTime,
  randomizeNotifications,
  randomlyScheduleXnotifications,
  scheduleReminderNotifications,
  setChimeSoundName,
};
