import { canScheduleExactAlarms } from 'react-native-permissions';
import { after, priorities, setPriority } from 'shoutem-core';
import { ALARM_PERMISSION_STATUSES } from './const';
import { setAlarmPermissionStatus } from './redux';

export const appDidMount = setPriority(app => {
  const store = app.getStore();

  const hasAlarmPermission = canScheduleExactAlarms();
  const permissionStatus = hasAlarmPermission
    ? ALARM_PERMISSION_STATUSES.GRANTED
    : ALARM_PERMISSION_STATUSES.DENIED;

  store.dispatch(setAlarmPermissionStatus(permissionStatus));
}, after(priorities.INIT));
