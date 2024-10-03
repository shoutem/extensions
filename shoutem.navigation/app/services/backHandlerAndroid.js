import { BackHandler, ToastAndroid } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { isWeb } from 'shoutem-core';
import { ext } from '../const';

const ALLOW_EXIT_DURATION = 3000;

let exitAlertDisplayed = false;

export function displayAlert() {
  if (isWeb) {
    return;
  }

  exitAlertDisplayed = true;
  ToastAndroid.show(I18n.t(ext('androidExitMessage')), ToastAndroid.LONG);
  setTimeout(() => {
    exitAlertDisplayed = false;
  }, ALLOW_EXIT_DURATION);
}

export function isAlertDisplayed() {
  return exitAlertDisplayed;
}

export function addListener(listener) {
  if (isWeb) {
    return;
  }

  BackHandler.addEventListener('hardwareBackPress', listener);
}

export function removeListener(listener) {
  if (isWeb) {
    return;
  }

  BackHandler.removeEventListener('hardwareBackPress', listener);
}

export default {
  displayAlert,
  isAlertDisplayed,
  exitApp: BackHandler.exitApp,
  addListener,
  removeListener,
};
