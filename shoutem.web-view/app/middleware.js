import { Alert, Linking } from 'react-native';
import _ from 'lodash';
import { I18n } from 'shoutem.i18n';
import { getCurrentRoute, NAVIGATION_ITEM_PRESSED } from 'shoutem.navigation';
import { priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import {
  getResetWebViewCallback,
  getUser,
  OPEN_EXTERNAL_BROWSER,
} from './redux';
import { parseUrl } from './services';

const openWebViewScreen = store => next => action => {
  if (action.type === OPEN_EXTERNAL_BROWSER) {
    const { url } = action;

    const state = store.getState();
    const ownUser = getUser(state);

    const resolvedUrl = parseUrl(url, ownUser);

    return url
      ? Linking.openURL(resolvedUrl)
      : Alert.alert(
          I18n.t(ext('noUrlErrorTitle')),
          I18n.t(ext('noUrlErrorMessage')),
        );
  }

  return next(action);
};

const resetWebViewMiddleware = store => next => action => {
  if (action.type === NAVIGATION_ITEM_PRESSED) {
    const shortcutId = action.payload.id;

    const state = store.getState();

    const currentlyActiveShortcutId = _.get(
      getCurrentRoute(),
      'params.shortcut.id',
    );

    if (currentlyActiveShortcutId === shortcutId) {
      const resetWebView = getResetWebViewCallback(state, shortcutId);

      if (_.isFunction(resetWebView)) {
        resetWebView();
      }
    }
  }

  return next(action);
};

setPriority(openWebViewScreen, priorities.NAVIGATION);

export { openWebViewScreen, resetWebViewMiddleware };
