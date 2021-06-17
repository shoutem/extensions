import { registerIcons } from '@shoutem/ui';
import { Delete, Download } from './assets';
import { registerNotificationHandlers } from './notificationHandlers';

export function appWillMount() {
  const iconConfigs = [
    { name: 'download', icon: Download },
    { name: 'delete', icon: Delete },
  ];

  registerIcons(iconConfigs);
}

export function appDidMount(app) {
  const store = app.getStore();

  registerNotificationHandlers(store);
}
