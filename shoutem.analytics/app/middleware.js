import _ from 'lodash';
import { getAppId } from 'shoutem.application';
import { getCurrentRoute } from 'shoutem.navigation';
import { after, priorities, setPriority } from 'shoutem-core';
import { EVENT, isAnalyticsAction, SCREEN_VIEW } from './redux';

// Use to intercept analytics actions and provide more data to the action
export const ANALYTICS_MIDDLEWARE_PRIORITY = priorities.NAVIGATION;
// Use to intercept analytics actions and pass data to native SDK or server
export const ANALYTICS_OUT_MIDDLEWARE_PRIORITY = after(
  ANALYTICS_MIDDLEWARE_PRIORITY,
);

function getExtensionNameFromScreen(screen) {
  const extensionName = screen && _.slice(screen.split('.'), 0, 2);
  return extensionName ? `${extensionName[0]}.${extensionName[1]}` : undefined;
}

/**
 * Create middleware which will only be invoked if
 * analytic action type is {@see EVENT}
 * @param middleware
 * @returns {middleware}
 */
export function createEventsMiddleware(middleware) {
  return store => next => action => {
    if (action.type === EVENT) {
      middleware(action, store);
    }
    return next(action);
  };
}

/**
 * Create middleware which will only be invoked if
 * analytic action type is {@see SCREEN_VIEW}
 * @param middleware
 * @returns {middleware}
 */
export function createScreenViewMiddleware(middleware) {
  return store => next => action => {
    if (action.type === SCREEN_VIEW) {
      middleware(action, store);
    }
    return next(action);
  };
}

/**
 * Additional data provided to analytics action.
 * @param store
 * @returns {{appId: *, screen: V, shortcut: *}}
 */
function getApplicationAnalyticsData() {
  const activeRoute = getCurrentRoute();

  const screenName = activeRoute.name;
  const extension = getExtensionNameFromScreen(screenName);
  const shortcutId = (_.get(activeRoute, 'params.shortcut') || {}).id;
  const appId = `${getAppId()}`; // All GA dimensions values should be sent as strings
  const previousRouteName = _.get(activeRoute, 'params.previousRoute.name');
  const analyticsPayload = _.get(activeRoute, 'params.analyticsPayload');

  return {
    appId,
    extension,
    screen: screenName,
    shortcutId,
    previousRouteName,
    ...analyticsPayload,
  };
}

/**
 * Used to extend analytics actions with application data (appId, screen, shortcut)
 */
const injectApplicationDataToAnalyticsAction = store => next => action => {
  if (isAnalyticsAction(action)) {
    _.assign(action.payload, getApplicationAnalyticsData());
  }
  return next(action);
};
setPriority(
  injectApplicationDataToAnalyticsAction,
  ANALYTICS_MIDDLEWARE_PRIORITY,
);

export default [injectApplicationDataToAnalyticsAction];
