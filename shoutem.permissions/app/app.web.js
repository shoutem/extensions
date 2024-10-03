import { after, priorities, setPriority } from 'shoutem-core';
import { ALARM_PERMISSION_STATUSES } from './const';
import { setAlarmPermissionStatus } from './redux';

export const appDidMount = setPriority(app => {
  const store = app.getStore();

  // Disallow alarm permission for web
  store.dispatch(setAlarmPermissionStatus(ALARM_PERMISSION_STATUSES.DENIED));
}, after(priorities.INIT));
