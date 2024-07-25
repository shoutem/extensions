import { before, priorities, setPriority } from 'shoutem-core';
import { registerNotificationHandlers } from './notificationHandlers';

export const appWillMount = setPriority(app => {
  const store = app.getStore();

  registerNotificationHandlers(store);
}, before(priorities.FIREBASE));
