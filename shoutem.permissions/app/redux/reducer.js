import { combineReducers } from 'redux';
import { ALARM_PERMISSION_STATUSES } from '../const';
import {
  SET_ALARM_PERMISSION_PROMPT_STATUS,
  SET_ALARM_PERMISSION_STATUS,
} from './actions';

export function alarmPermissionStatus(
  state = ALARM_PERMISSION_STATUSES.UNKNOWN,
  action,
) {
  if (action.type === SET_ALARM_PERMISSION_STATUS) {
    return action.payload;
  }

  return state;
}

export function alarmPromptStatus(state = false, action) {
  if (action.type === SET_ALARM_PERMISSION_PROMPT_STATUS) {
    return action.payload;
  }

  return state;
}

export default combineReducers({
  alarmPermissionStatus,
  promptStatus: alarmPromptStatus,
});
