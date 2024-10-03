export const Firebase = {
  createNotificationChannels: () => Promise.resolve(),
  obtainFCMToken: () => Promise.resolve(),
  scheduleLocalNotification: () => null,
  scheduleLocalNotificationIos: () => null,
  clearBadge: () => null,
  selectGroups: () => null,
  presentLocalNotification: () => null,
  subscribeToTopic: () => null,
  unsubscribeFromTopic: () => null,
};

export const consumeNotification = () => null;
export const NotificationHandlers = {
  registerNotificationReceivedHandlers: () => null,
  registerFCMTokenReceivedHandler: () => null,
  registerAPNSTokenReceivedHandler: () => null,
};
export const queueNotification = () => null;
