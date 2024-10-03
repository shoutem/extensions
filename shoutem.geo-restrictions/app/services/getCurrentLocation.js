/* eslint-disable no-console */
import Geolocation from '@react-native-community/geolocation';
import { I18n } from 'shoutem.i18n';
import {
  checkPermissions,
  openDeviceSettings,
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import { isIos } from 'shoutem-core';
import { ext } from '../const';

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
    checkPermissions(LOCATION_PERMISSION)
      .then(result => {
        // Permission is not yet requested/ denied, but requestable
        if (result === RESULTS.DENIED) {
          return requestPermissions(LOCATION_PERMISSION)
            .then(result => {
              if (result[LOCATION_PERMISSION] === RESULTS.GRANTED) {
                return Geolocation.getCurrentPosition(
                  resolve,
                  reject,
                  LOCATION_OPTIONS,
                );
              }

              return reject();
            })
            .catch(error => reject(error));
        }

        // Permission is granted
        if (result === RESULTS.GRANTED) {
          return Geolocation.getCurrentPosition(
            resolve,
            reject,
            LOCATION_OPTIONS,
          );
        }

        // The permission is denied and not requestable anymore, or unavailable. In that case, open
        // the device settings prompt. This should happen only once, on the first launch, as the subsequent
        // app launches will detect the previous scenarios
        openDeviceSettings(
          I18n.t(ext('missingPermissionsTitle')),
          I18n.t(ext('missingPermissionsMessage')),
        );

        return reject(I18n.t(ext('missingPermissionsTitle')));
      })
      .catch(error => reject(error));
  });
}
