import { Alert } from 'react-native';
import _ from 'lodash';
import { LOAD_REQUEST } from '@shoutem/redux-io';
import { I18n } from 'shoutem.i18n';
import { SET_NAVIGATION_INITIALIZED } from 'shoutem.navigation';
import { priorities, setPriority } from 'shoutem-core';
import { openInitialScreen } from './shared/openInitialScreen';
import { ext } from './const';
import {
  getAppInitQueue,
  getSubscriptionValidState,
  RESTART_APP,
} from './redux';
import { restartApp } from './services';

const alertNoInternet = _.throttle(
  () =>
    Alert.alert(
      I18n.t(ext('networkErrorTitle')),
      I18n.t(ext('networkErrorMessage')),
    ),
  15 * 1000,
  { leading: true, trailing: false },
);

// eslint-disable-next-line no-unused-vars
const noInternetMiddleware = store => next => action => {
  if (action.type === LOAD_REQUEST && action.error) {
    alertNoInternet();
  }
  return next(action);
};

const restartAppMiddleware = setPriority(
  // eslint-disable-next-line no-unused-vars
  store => next => action => {
    const actionType = _.get(action, 'type');

    if (actionType === RESTART_APP) {
      restartApp();
    }

    return next(action);
  },
  priorities.LAST,
);

const navigationInitializedMiddleware = setPriority(
  store => next => action => {
    const actionType = _.get(action, 'type');

    if (actionType === SET_NAVIGATION_INITIALIZED) {
      const state = store.getState();
      const subscriptionValid = getSubscriptionValidState(state);
      const appInitQueue = getAppInitQueue(state);

      // If all initializations are complete and navigation is about to be
      // initialized, open the initial screen.
      if (
        _.size(Object.keys(appInitQueue).filter(target => target === false)) ===
        0
      ) {
        openInitialScreen(subscriptionValid);
      }
    }

    return next(action);
  },
  priorities.INIT,
);

export {
  navigationInitializedMiddleware,
  noInternetMiddleware,
  restartAppMiddleware,
};
