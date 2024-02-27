import { registerNotificationHandlers } from './notificationHandlers';

export async function appDidMount(app) {
  const store = app.getStore();

  registerNotificationHandlers(store);
}
