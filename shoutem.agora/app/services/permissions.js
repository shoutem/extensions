import { Alert, Platform } from 'react-native';
import {
  checkMultiple,
  request,
  requestMultiple,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

const MIC_PERMISSIONS = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;

const CAM_PERMISSIONS = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

function openSettingsIos() {
  Alert.alert(
    I18n.t(ext('missingPermissionsTitle')),
    I18n.t(ext('missingPermissionsMessage')),
    [
      {
        text: I18n.t(ext('cancel')),
        style: 'cancel',
      },
      {
        text: I18n.t(ext('openSettings')),
        onPress: () => openSettings(),
      },
      { cancelable: true },
    ],
  );
}

// this function checks camera and microphone status and requests permissions if not yet requested
export function requestPermissions() {
  checkMultiple([CAM_PERMISSIONS, MIC_PERMISSIONS])
    .then((currentStatus) => {
      const camera = currentStatus[CAM_PERMISSIONS];
      const microphone = currentStatus[MIC_PERMISSIONS];

      if (camera === RESULTS.DENIED && microphone === RESULTS.DENIED) {
        return requestMultiple([CAM_PERMISSIONS, MIC_PERMISSIONS]);
      }

      if (camera === RESULTS.DENIED && microphone !== RESULTS.DENIED) {
        return request(CAM_PERMISSIONS);
      }

      if (camera !== RESULTS.DENIED && microphone === RESULTS.DENIED) {
        return request(MIC_PERMISSIONS);
      }
    })
    .catch((error) => {
      console.log('Request Camera permission failed:', error);
    });
}

// this function checks camera and microphone status and opens Settings Page if permissions have not been granted
export function checkPermissions() {
  return checkMultiple([CAM_PERMISSIONS, MIC_PERMISSIONS])
    .then((statuses) => {
      const camera = statuses[CAM_PERMISSIONS];
      const microphone = statuses[MIC_PERMISSIONS];

      if (microphone === RESULTS.GRANTED && camera === RESULTS.GRANTED) {
        return true;
      }
      openSettingsIos();
      return false;
    })
    .catch((error) => {
      console.log('Check camera permission failed:', error);
    });
}
