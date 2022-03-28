import { registerNotificationHandlers } from './notificationHandlers';

export function appDidMount(app) {
  const store = app.getStore();

  registerNotificationHandlers(store);
}
