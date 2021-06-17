import autoBind from 'auto-bind';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { I18n } from 'shoutem.i18n';
import {
  checkPermissions,
  openDeviceSettings,
  PERMISSION_RESULT_TYPES,
  PERMISSION_TYPES,
} from 'shoutem.permissions';
import { ext } from '../const';

const { BLOCKED, DENIED, GRANTED, UNAVAILABLE } = PERMISSION_RESULT_TYPES;
const {
  ANDROID_READ_EXTERNAL_STORAGE: readPermission,
  ANDROID_WRITE_EXTERNAL_STORAGE: writePermission,
} = PERMISSION_TYPES;

class EpisodeDownloadManager {
  constructor() {
    autoBind(this);
  }

  download(episodeUrl) {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        checkPermissions(readPermission, writePermission)
          .then(statuses => {
            const readStatus = statuses[readPermission];
            const writeStatus = statuses[writePermission];

            if (readStatus === GRANTED && writeStatus === GRANTED) {
              RNFetchBlob.config({ fileCache: true, appendExt: 'mp3' })
                .fetch('GET', episodeUrl)
                .then(({ path }) => resolve(path()))
                .catch(error => reject(error));
            }

            if (
              readStatus === BLOCKED ||
              readStatus === DENIED ||
              writeStatus === BLOCKED ||
              writeStatus === DENIED
            ) {
              openDeviceSettings(
                I18n.t(ext('deviceSettingsTitle')),
                I18n.t(ext('deviceSettingsDescription')),
              );
              resolve(undefined);
            }

            if (readStatus === UNAVAILABLE || writeStatus === UNAVAILABLE) {
              reject('Read and/or Write not available on this Android device');
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.error(
              'Error checking Android read and write external storage permissions:',
              error,
            );
            reject(error);
          });
      }

      RNFetchBlob.config({ fileCache: true, appendExt: 'mp3' })
        .fetch('GET', episodeUrl)
        .then(({ path }) => resolve(path()))
        .catch(error => reject(error));
    });
  }

  remove(episodePath) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs
        .unlink(episodePath)
        .then(resolve)
        .catch(errorMessage => reject(errorMessage));
    });
  }
}

export const episodeDownloadManager = new EpisodeDownloadManager();
