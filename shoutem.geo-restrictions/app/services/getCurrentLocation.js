import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { I18n } from 'shoutem.i18n';
import {
  checkPermissions,
  openDeviceSettings,
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import { ext } from '../const';

const isIos = Platform.OS === 'ios';

const LOCATION_PERMISSION = isIos
  ? PERMISSION_TYPES.IOS_LOCATION_WHEN_IN_USE
  : PERMISSION_TYPES.ANDROID_ACCESS_FINE_LOCATION;

const LOCATION_OPTIONS = {
  enableHighAccuracy: isIos,
  timeout: 15000,
  maximumAge: 36000,
};

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    checkPermissions(LOCATION_PERMISSION).then(result => {
      if (result === RESULTS.DENIED) {
        requestPermissions(LOCATION_PERMISSION).then(result => {
          if (result[LOCATION_PERMISSION] === RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              position => {
                return resolve(position);
              },
              error => {
                console.log(error.code, error.message);
                return reject(error);
              },
              LOCATION_OPTIONS,
            );
          }
        });
      }

      if (result === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            return resolve(position);
          },
          error => {
            console.log(error.code, error.message);
            return reject(error);
          },
          LOCATION_OPTIONS,
        );
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        openDeviceSettings(
          I18n.t(ext('missingPermissionsTitle')),
          I18n.t(ext('missingPermissionsMessage')),
        );
        return reject(I18n.t(ext('missingPermissionsTitle')));
      }
    });
  });
}
