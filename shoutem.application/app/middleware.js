import _ from 'lodash';
import { priorities, setPriority } from 'shoutem-core';
import { LOAD_REQUEST } from '@shoutem/redux-io';
import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';
import {
  RESTART_APP,
  QUEUE_TARGET_COMPLETED,
  getSubscriptionValidState,
  getAppInitQueue,
} from './redux';
import { restartApp } from './services';
import { openInitialScreen } from './shared/openInitialScreen';
import { ext } from './const';

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

const appInitQueueMiddleware = store => next => action => {
  const actionType = _.get(action, 'type');

  if (actionType === QUEUE_TARGET_COMPLETED) {
    const state = store.getState();
    const subscriptionValid = getSubscriptionValidState(state);
    const appInitQueue = getAppInitQueue(state);
    const hasMatchingTarget =
      _.has(appInitQueue, action.payload) &&
      appInitQueue[action.payload] === false;
    const isLastQueuedTarget =
      _.size(_.filter(appInitQueue, target => target === false)) < 2;

    if (hasMatchingTarget && isLastQueuedTarget) {
      openInitialScreen(subscriptionValid);
    }
  }

  return next(action);
};

export { noInternetMiddleware, restartAppMiddleware, appInitQueueMiddleware };
