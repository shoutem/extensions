import { Alert } from 'react-native';
import { checkAndRequestAlarmPermission } from 'react-native-permissions';
import { I18n } from 'shoutem.i18n';
import { ALARM_PERMISSION_STATUSES, ext } from '../const';
import {
  getAlarmPermissionPromptStatus,
  getAlarmPermissionStatus,
} from './selectors';

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

export function withAlarmPermission(action) {
  return (dispatch, getState) => {
    const state = getState();
    const permissionStatus = getAlarmPermissionStatus(state);
    const hasPromptedForPermission = getAlarmPermissionPromptStatus(state);

    if (permissionStatus === ALARM_PERMISSION_STATUSES.GRANTED) {
      action();
      return;
    }

    if (
      permissionStatus === ALARM_PERMISSION_STATUSES.DENIED &&
      hasPromptedForPermission
    ) {
      return;
    }

    if (
      permissionStatus === ALARM_PERMISSION_STATUSES.DENIED &&
      !hasPromptedForPermission
    ) {
      const openSettingsAction = {
        text: I18n.t(ext('openSettings')),
        onPress: () =>
          checkAndRequestAlarmPermission().then(granted => {
            if (granted) {
              dispatch(
                setAlarmPermissionStatus(ALARM_PERMISSION_STATUSES.GRANTED),
              );
              dispatch(setAlarmPromptComplete());
              action();
            }
          }),
      };

      const cancelAction = {
        text: I18n.t(ext('cancel')),
        onPress: () => dispatch(setAlarmPromptComplete()),
      };

      Alert.alert(
        I18n.t(ext('missingPermissionsTitle')),
        I18n.t(ext('alarmPermissionRationale')),
        [openSettingsAction, cancelAction],
      );
    }
  };
}
