import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import autoBind from 'auto-bind';
import _ from 'lodash';
import { I18n } from 'shoutem.i18n';
import {
  openDeviceSettings,
  PERMISSION_RESULT_TYPES,
  PERMISSION_TYPES,
  requestPermissions,
} from 'shoutem.permissions';
import { ext } from '../const';

const { BLOCKED, DENIED, GRANTED, UNAVAILABLE } = PERMISSION_RESULT_TYPES;
const {
  ANDROID_READ_EXTERNAL_STORAGE: readPermission,
  ANDROID_WRITE_EXTERNAL_STORAGE: writePermission,
} = PERMISSION_TYPES;

const PERMISSION_UNAVAILABLE = 'PERMISSION_UNAVAILABLE';
const isAndroid = Platform.OS === 'android';

export function getDownloadDir(isOnOldPath) {
  const {
    fs: { dirs },
  } = ReactNativeBlobUtil;

  if (isAndroid) {
    return dirs.DownloadDir;
  }

  return isOnOldPath ? dirs.CacheDir : dirs.DocumentDir;
}

export function getFileNameFromPath(path) {
  const sections = path.split('/');

  return sections[sections.length - 1];
}

// Prior to v5.0.0, downloaded episodes had paths instead of file names. iOS
// breaks these paths when the app is updated, so we now dynamically generate
// the path for a given episode.
export function getPathFromEpisode(downloadedEpisode) {
  const { path } = downloadedEpisode;

  if (isAndroid) {
    return path || `${getDownloadDir()}/${downloadedEpisode.fileName}`;
  }

  return path
    ? `${getDownloadDir(true)}/${getFileNameFromPath(path)}`
    : `${getDownloadDir()}/${downloadedEpisode.fileName}`;
}

export function getPathFromFileName(fileName) {
  return `${getDownloadDir()}/${fileName}`;
}

class EpisodeDownloadManager {
  constructor() {
    autoBind(this);

    this.PERMISSION_UNAVAILABLE = PERMISSION_UNAVAILABLE;
  }

  download(episodeUrl) {
    return new Promise((resolve, reject) => {
      const downloadConfig = {
        path: `${getDownloadDir()}/${_.uniqueId()}.mp3`,
      };

      if (Platform.OS === 'ios') {
        return ReactNativeBlobUtil.config(downloadConfig)
          .fetch('GET', episodeUrl)
          .then(({ path }) => resolve(path()))
          .catch(error => reject(error));
      }

      requestPermissions(readPermission, writePermission)
        .then(statuses => {
          const readStatus = statuses[readPermission];
          const writeStatus = statuses[writePermission];

          if (readStatus === GRANTED && writeStatus === GRANTED) {
            return ReactNativeBlobUtil.config(downloadConfig)
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
            reject(PERMISSION_UNAVAILABLE);
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
    });
  }

  remove(episodePath) {
    return new Promise((resolve, reject) => {
      ReactNativeBlobUtil.fs
        .unlink(episodePath)
        .then(resolve)
        .catch(errorMessage => reject(errorMessage));
    });
  }
}

export const episodeDownloadManager = new EpisodeDownloadManager();
