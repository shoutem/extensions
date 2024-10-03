import { Alert, AppState } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import Uri from 'urijs';
import LiveUpdate from '@shoutem/live-update';
import rio from '@shoutem/redux-io';
import {
  buildConfig,
  getAppId,
  getExtensionCloudUrl,
  isProduction,
} from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { isIos } from 'shoutem-core';
import { ext, LIVE_UPDATE_STATUS_SCHEMA } from './const';
import {
  fetchLiveUpdateStatus,
  getCurrentVersion,
  setCurrentVersion,
} from './redux';

const AUTH_HEADER = `Bearer ${buildConfig.authorization}`;

function syncWithLiveUpdate(app) {
  const store = app.getStore();
  const state = store.getState();

  const binaryVersionNameProp = isIos
    ? 'iosBinaryVersionName'
    : 'androidBinaryVersionName';
  const bundleVersionCodeProp = isIos
    ? 'iosBundleVersionCode'
    : 'androidBundleVersionCode';
  const bundleUrl = isIos ? 'iosBundleUrl' : 'androidBundleUrl';
  const currentBundleVersionCode = getCurrentVersion(state);

  store
    .dispatch(fetchLiveUpdateStatus())
    .then(response => {
      const data = _.get(response, 'payload.data.attributes');
      const appBinaryVersion = DeviceInfo.getVersion();

      const remoteBinaryVersionName = data[binaryVersionNameProp];
      const remoteBundleVersionCode = data[bundleVersionCodeProp];

      const matchingBinaryVersions =
        appBinaryVersion === remoteBinaryVersionName;
      const shouldDownloadNewBundle =
        matchingBinaryVersions &&
        !!remoteBundleVersionCode &&
        remoteBundleVersionCode > currentBundleVersionCode;

      if (shouldDownloadNewBundle) {
        LiveUpdate.downloadUpdatePackage(
          data[bundleUrl],
          remoteBundleVersionCode.toString(),
        )
          .then(() => {
            store.dispatch(setCurrentVersion(remoteBundleVersionCode));
            Alert.alert(
              I18n.t(ext('newContentAlertTitle')),
              I18n.t(ext('newContentAlertMessage')),
              [
                {
                  text: I18n.t(ext('laterButton')),
                  onPress: () => {},
                },
                {
                  text: I18n.t(ext('acceptButton')),
                  onPress: () => LiveUpdate.restartApp(),
                },
              ],
            );
          })
          .catch(console.log);
      }
    })
    .catch(console.log);
}

let appStateListener;
let handleAppStateChange;

const createHandleAppStateChange = app => state => {
  if (state === 'active') {
    syncWithLiveUpdate(app);
  }
};

export function appDidMount(app) {
  if (!isProduction()) {
    return;
  }

  const store = app.getStore();
  const state = store.getState();

  const cloudHost = getExtensionCloudUrl(state, ext());
  const appId = getAppId();

  rio.registerResource({
    schema: LIVE_UPDATE_STATUS_SCHEMA,
    request: {
      endpoint: new Uri(`${cloudHost}/v1/apps/${appId}`).toString(),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: AUTH_HEADER,
      },
    },
  });

  syncWithLiveUpdate(app);
  handleAppStateChange = createHandleAppStateChange(app);
  // Check for updates on app resume
  appStateListener = AppState.addEventListener('change', handleAppStateChange);
}

export function appWillUnmount() {
  if (isProduction()) {
    appStateListener.remove();
  }
}
