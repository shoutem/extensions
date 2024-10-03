import { Platform } from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import { Firebase } from 'shoutem.firebase';
import {
  REMINDER_CHANNEL_ID,
  REPEAT_CONFIG,
  SCHEDULED_NOTIFICATIONS_CHANNEL_ID,
} from '../const';
import { parseTimeToTimeObject } from './calendar';

let chimeSoundName = '';

function setChimeSoundName(soundName) {
  chimeSoundName = soundName;
}

function scheduleLocalNotifications(
  notification,
  additionalConfig,
  useChimeSound = false,
) {
  const {
    delay,
    title,
    body,
    channelId = SCHEDULED_NOTIFICATIONS_CHANNEL_ID,
  } = notification;

  const scheduleDate = moment()
    .add(delay, 'minutes')
    .toDate();

  const defaultConfig = {
    id: additionalConfig.notificationId, // has to be stringified integer
    date: scheduleDate,
    message: body,
    soundName: (useChimeSound && chimeSoundName) || 'default',
    title,
    userInfo: additionalConfig,
  };

  if (Platform.OS === 'ios') {
    return Firebase.scheduleLocalNotification(defaultConfig);
  }

  return Firebase.scheduleLocalNotification({
    ...defaultConfig,
    allowWhileIdle: true, // (optional) set notification to work while on doze, default: false,
    channelId, // android only
  });
}

function cancelLocalNotifications(triggerId) {
  return Promise.resolve();
}

function scheduleRepeatingNotifications(message, date) {
  if (Platform.OS === 'ios') {
    const config = {
      id: _.uniqueId(), // has to be stringified integer
      fireDate: date,
      body: message,
      title: '',
      repeats: true,
      repeatsComponent: {
        hour: true,
        minute: true,
      },
      sound: chimeSoundName || 'default',
    };

    return Firebase.scheduleLocalNotificationIos(config);
  }

  const config = {
    allowWhileIdle: true, // (optional) set notification to work while on doze, default: false,
    channelId: REMINDER_CHANNEL_ID, // android only
    id: _.uniqueId(), // has to be stringified integer
    date,
    message,
    soundName: chimeSoundName || 'default',
    title: '',
    ...REPEAT_CONFIG,
  };

  return Firebase.scheduleLocalNotification(config);
}

function cancelReminderNotifications() {
  return Promise.resolve();
}

async function rescheduleReminderNotifications(
  appNotificationSettings,
  reminder,
) {
  await cancelReminderNotifications();

  _.forEach(appNotificationSettings.reminderTimes, async selectedTime => {
    await scheduleReminderNotification(reminder.message, selectedTime);
  });
}

async function scheduleReminderNotification(message, reminderTime) {
  const reminderTimeObject = parseTimeToTimeObject(reminderTime);
  const now = moment();
  let date = moment()
    .set({
      hours: reminderTimeObject.hours,
      minutes: reminderTimeObject.minutes,
      seconds: 0,
    })
    .toDate();

  // if user selected time is past, iOS won't schedule notification
  if (moment(date).isBefore(now)) {
    date = moment(date)
      .add(1, 'days')
      .toDate();
  }

  await scheduleRepeatingNotifications(message, date);
}

function cancelScheduledNotifications() {
  return Promise.resolve();
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
    const { message } = randomMessage;

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
  cancelLocalNotifications,
  cancelReminderNotifications,
  cancelScheduledNotifications,
  randomizeTime,
  randomizeNotifications,
  randomlyScheduleXnotifications,
  scheduleLocalNotifications,
  rescheduleReminderNotifications,
  scheduleReminderNotification,
  setChimeSoundName,
};
