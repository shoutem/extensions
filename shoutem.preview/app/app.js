import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  RESTART_APP,
  isProduction,
  getAppId,
} from 'shoutem.application';

const bundleId = DeviceInfo.getBundleId();
const previewAppsIds = [
  'com.shoutem.builder.preview',
  'com.shoutem.extensions.preview',
];

export const isPreviewApp = previewAppsIds.includes(bundleId);

function getAppIdFromUrl(url) {
  const matches = url.match(/preview:\/\/open-app\/([0-9]*)/);
  return matches && matches.length ? matches[1] : undefined;
}

function listenForDeepLinks(dispatch) {
  Linking.addEventListener('url', (deepLink) => {
    const appId = getAppIdFromUrl(deepLink.url);
    // check if link is for the right app
    if (appId === getAppId()) {
      // restart app to run app lifecycle from start
      dispatch({ type: RESTART_APP });
    }
  });
}

export const appDidMount = (app) => {
  const { dispatch } = app.getStore();

  if (!isProduction()) {
    listenForDeepLinks(dispatch);
  }
};

export function appWillUnmount() {
  Linking.removeEventListener('url');
}
