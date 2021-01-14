import { Alert } from 'react-native';
import _ from 'lodash';
import {
  check,
  checkMultiple,
  request,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';
import { I18n } from 'shoutem.i18n';
import { ext, PERMISSION_RESULT_TYPES } from './const';

const { DENIED } = PERMISSION_RESULT_TYPES;

// this function displays alert with an option to open app device settings
export function openDeviceSettings(title, message) {
  const alertTitle = title || I18n.t(ext('missingPermissionsTitle'));
  const alertMessage = message || I18n.t(ext('missingPermissionsMessage'));

  Alert.alert(alertTitle, alertMessage, [
    {
      text: I18n.t(ext('cancel')),
      style: 'cancel',
    },
    {
      text: I18n.t(ext('openSettings')),
      onPress: () => openSettings(),
    },
    { cancelable: true },
  ]);
}

// this function checks statuses of one or more permissions.
export function checkPermissions(...permissions) {
  const isMultiplePermissions = permissions.length > 1;

  if (isMultiplePermissions) {
    return checkMultiple(permissions).catch(error => {
      console.log(`Check ${permissions} permissions failed:`, error);
    });
  }

  return check(permissions).catch(error => {
    console.log(`Check ${permissions} permission failed:`, error);
  });
}

// this function checks the status of one or more permissions and requests permissions only for those that are DENIED (not requested yet).
export function requestPermissions(...permissions) {
  let deniedPermissions = [];

  const checkPermissions = _.map(permissions, permission =>
    check(permission)
      .then(result => {
        if (result === DENIED) {
          deniedPermissions.push(permission);
        }
      })
      .catch(error => {
        console.log(`Check ${permission} permission failed:`, error);
      }),
  );

  Promise.all(checkPermissions).then(() => {
    if (_.isEmpty(deniedPermissions)) {
      return;
    }

    if (deniedPermissions.length > 1) {
      return requestMultiple(deniedPermissions).catch(error => {
        console.log(`Request ${deniedPermissions} permissions failed:`, error);
      });
    }

    return request(_.head(deniedPermissions)).catch(error => {
      console.log(`Request ${deniedPermissions} permission failed:`, error);
    });
  });
}
