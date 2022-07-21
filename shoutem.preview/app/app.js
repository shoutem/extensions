import React from 'react';
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getAppId, isProduction, RESTART_APP } from 'shoutem.application';
import { PreviewProvider } from './providers';

let previewApp;

const bundleId = DeviceInfo.getBundleId();

const discloseAppsIds = ['com.disclose', 'com.shoutem.disclose'];
const previewAppsIds = [
  'com.shoutem.builder.preview',
  'com.shoutem.extensions.preview',
  ...discloseAppsIds,
];

export const isPreviewApp = previewAppsIds.includes(bundleId);
export const isDiscloseApp = discloseAppsIds.includes(bundleId);

function getAppIdFromUrl(url) {
  const matches = url.match(/preview:\/\/open-app\/([0-9]*)/);
  return matches && matches.length ? matches[1] : undefined;
}

function listenForDeepLinks(dispatch) {
  Linking.addEventListener('url', deepLink => {
    const appId = getAppIdFromUrl(deepLink.url);
    // check if link is for the right app
    if (appId === getAppId()) {
      // restart app to run app lifecycle from start
      dispatch({ type: RESTART_APP });
    }
  });
}

export const appDidMount = app => {
  const { dispatch } = app.getStore();

  if (!isProduction()) {
    listenForDeepLinks(dispatch);
  }
};

export function appWillMount(app) {
  previewApp = app;
}

export function appWillUnmount() {
  Linking.removeEventListener('url');
}

export function renderProvider(children) {
  if (isDiscloseApp) {
    return <PreviewProvider app={previewApp}>{children}</PreviewProvider>;
  }

  return children;
}
