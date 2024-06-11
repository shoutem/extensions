import { ALARM_PERMISSION_STATUSES, ext } from '../const';

export function getAlarmPermissionStatus(state) {
  return state[ext()].alarmPermissionStatus;
}

export function getAlarmPermissionPromptStatus(state) {
  return state[ext()].promptStatus;
}

export function alarmPermissionGranted(state) {
  return getAlarmPermissionStatus(state) === ALARM_PERMISSION_STATUSES.GRANTED;
}

export function alarmPermissionUnknown(state) {
  return getAlarmPermissionStatus(state) === ALARM_PERMISSION_STATUSES.UNKNOWN;
}
