import { ext } from '../const';

export const SET_ALARM_PERMISSION_STATUS = ext('SET_ALARM_PERMISSION_STATUS');
export const SET_ALARM_PERMISSION_PROMPT_STATUS = ext(
  'SET_ALARM_PERMISSION_PROMPT_STATUS',
);

export function setAlarmPermissionStatus(status) {
  return {
    type: SET_ALARM_PERMISSION_STATUS,
    payload: status,
  };
}

export function setAlarmPromptComplete() {
  return {
    type: SET_ALARM_PERMISSION_PROMPT_STATUS,
    payload: true,
  };
}

export function withAlarmPermission() {
  return () => {};
}
