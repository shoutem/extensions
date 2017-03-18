import { isRSAA, RSAA } from 'redux-api-middleware';
import * as _ from 'lodash';
import URI from 'urijs';

import { redirectTo, NAVIGATE, NavigationOperations } from '@shoutem/core/navigation';
import { priorities, setPriority, before } from '@shoutem/core/middlewareUtils';
import { RESTART_APP } from '@shoutem/core/coreRedux';
import { getExtensionSettings } from 'shoutem.application';

import { ext } from './const';
import { isAuthenticated, LOGOUT, AUTHENTICATE } from './redux';
import { getAuthHeader } from './shared/getAuthHeader';
import { isAuthenticationRequired } from './isAuthenticationRequired';
import { clearSession } from './session.js';

const APPLICATION_EXTENSION = 'shoutem.application';
const AUTH_HEADERS = 'headers.Authorization';

export function createLoginMiddleware(screens) {
  return setPriority(store => next => (action) => {
    if (action.type === NAVIGATE) {
      const state = store.getState();
      if (isAuthenticationRequired(screens, action, state) && !isAuthenticated(state)) {
        return next(redirectTo(action, {
          screen: ext('LoginScreen'),
          props: {
            action,
            onLoginSuccess: () => store.dispatch({
              ...action,
              operation: NavigationOperations.REPLACE,
            }),
          },
        }));
      }
    }

    return next(action);
  }, priorities.AUTH);
}

export const authenticateMiddleware = setPriority(store => next => (action) => {
  if (action.type === AUTHENTICATE) {
    const state = store.getState();

    if (isAuthenticated(state)) {
      action.callback(state[ext()].user);
    } else {
      store.dispatch({
        type: NAVIGATE,
        route: {
          screen: ext('LoginScreen'),
          props: {
            onLoginSuccess: action.callback,
          },
        },
      });
    }
  }

  return next(action);
}, priorities.AUTH);

/**
 * Sets header Authorization value for every network request to endpoints registered
 * in shoutem.application that doesn't already include any Authorization header
 */
export const networkRequestMiddleware = setPriority(store => next => (action) => {
  if (isRSAA(action)) {
    const state = store.getState();
    const appSettings = getExtensionSettings(state, APPLICATION_EXTENSION);

    const { legacyApiEndpoint, apiEndpoint } = appSettings;
    const servers = _.reduce([legacyApiEndpoint, apiEndpoint], (result, server) => {
      if (server) {
        result.push(new URI(server).hostname());
      }

      return result;
    }, []);
    const endpoint = new URI(action[RSAA].endpoint).hostname();
    if (servers.includes(endpoint) && !_.has(action[RSAA], AUTH_HEADERS)) {
      _.set(action[RSAA], AUTH_HEADERS, getAuthHeader(state));
    }
  }

  return next(action);
}, before(priorities.NETWORKING));

export const logoutMiddleware = setPriority(store => next => (action) => {
  const actionType = _.get(action, 'type');

  if (actionType === LOGOUT) {
    clearSession().then(
      () => store.dispatch({ type: RESTART_APP }),
      reason => console.warn(reason),
    );
  }
  return next(action);
}, priorities.AUTH);
