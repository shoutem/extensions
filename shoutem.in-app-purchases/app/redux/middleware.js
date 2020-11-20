import _ from 'lodash';
import { priorities, setPriority } from 'shoutem-core';
import {
  isNavigationAction,
  isEmptyRoute,
  redirectTo,
  rewrite,
  REPLACE,
} from 'shoutem.navigation';
import { getActiveShortcut, getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';
import {
  isSubscribed,
  isSubscriptionRequired,
  hasProperConfiguration,
} from './selectors';

const hasValidRoute = action => action.route && !isEmptyRoute(action.route);

const isShortcutProtected = (action, state) => {
  const activeShortcut = getActiveShortcut(state, action);
  const settings = getExtensionSettings(state, ext());

  const isProtected =
    _.get(activeShortcut, ['settings', _.camelCase(ext()), 'protected'], false);
  const shortcutScreen = _.get(activeShortcut, 'screen');
  const actionScreenType = _.get(action, 'route.screenType');
  const actionScreen = _.get(action, 'route.screen');

  const shortcutUnderProtection = isProtected || settings.allScreensProtected;

  return shortcutUnderProtection &&
    (shortcutScreen === actionScreen || shortcutScreen === actionScreenType);
}

export const subscribtionMiddleware = setPriority(store => next => (action) => {
  if (isNavigationAction(action) && hasValidRoute(action)) {
    const state = store.getState();

    if (
      isShortcutProtected(action, state)
      && !isSubscribed(state)
      && isSubscriptionRequired(state)
      && hasProperConfiguration(state)
    ) {
      return next(redirectTo(action, {
        screen: ext('SubscriptionsScreen'),
        props: {
          onSubscriptionObtained: () => store.dispatch(rewrite(action, REPLACE)),
          interceptedRoute: _.get(action, 'route', null),
        },
      }));
    }
  }

  return next(action);
}, priorities.AUTH);
