import { Alert } from 'react-native';
import _ from 'lodash';
import { isRSAA, RSAA } from 'redux-api-middleware';
import URI from 'urijs';
import { UPDATE_SUCCESS } from '@shoutem/redux-io';
import { getExtensionServiceUrl, RESTART_APP } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { before, priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import {
  AUTHENTICATE_LIMITED,
  clearAuthState,
  getAccessToken,
  getUser,
  isUserUpdateAction,
  LOGIN,
  LOGIN_INITIALIZED,
  LOGOUT,
  REGISTER,
} from './redux';
import { clearSession, getSession, saveSession } from './session.js';

function getAuthHeader(state) {
  return `Bearer ${getAccessToken(state)}`;
}

const APPLICATION_EXTENSION = 'shoutem.application';
const AUTH_HEADERS = 'headers.Authorization';

/**
 * Listens to user profile changes and updates the saved session.
 * When the app is restarted and we restore the session, it will have the updates.
 */
export const userUpdatedMiddleware = store => next => action => {
  if (action.type === UPDATE_SUCCESS && isUserUpdateAction(action)) {
    getSession().then((session = {}) => {
      const user = getUser(store.getState());

      const newSession = { ...JSON.parse(session), user };
      saveSession(JSON.stringify(newSession));
    });
  }
  return next(action);
};

let legacyApiDomain;

/**
 * Sets header Authorization value for every network request to endpoints registered
 * in shoutem.application that doesn't already include any Authorization header
 */
export const networkRequestMiddleware = setPriority(
  store => next => action => {
    if (isRSAA(action)) {
      const state = store.getState();

      if (!legacyApiDomain) {
        const cmsEndpoint = getExtensionServiceUrl(
          state,
          APPLICATION_EXTENSION,
          'cms',
        );

        legacyApiDomain = cmsEndpoint && new URI(cmsEndpoint).domain();
      }

      const endpointDomain = new URI(action[RSAA].endpoint).domain();

      if (
        legacyApiDomain === endpointDomain &&
        !_.has(action[RSAA], AUTH_HEADERS)
      ) {
        _.set(action[RSAA], AUTH_HEADERS, getAuthHeader(state));
      }
    }

    return next(action);
  },
  before(priorities.NETWORKING),
);

export const logoutMiddleware = setPriority(
  store => next => action => {
    const actionType = _.get(action, 'type');

    if (actionType === LOGOUT) {
      clearSession().then(
        () => store.dispatch({ type: RESTART_APP }),
        reason => console.warn(reason),
      );
    }
    return next(action);
  },
  priorities.AUTH,
);

export const authenticateMiddleware = setPriority(
  store => next => action => {
    const { type } = action;

    if (type === LOGIN_INITIALIZED) {
      const { openAuthFlow } = action.payload;
      openAuthFlow();
    }

    // If user profile ext is installed & user profile is required
    // this won't trigger
    if (type === LOGIN || type === REGISTER) {
      const {
        payload: { callback: onAuthSuccessCallback, user },
      } = action;

      if (onAuthSuccessCallback) {
        onAuthSuccessCallback(user);
      }
    }

    return next(action);
  },
  priorities.AUTH,
);

// Triggers if user profile extension is not required & manually approve members is active
export const authenticateLimitedMiddleware = setPriority(
  store => next => action => {
    const { type } = action;

    // User approved: false
    if (type === AUTHENTICATE_LIMITED) {
      const { payload: callback } = action;

      return Alert.alert(
        I18n.t(ext('manualApprovalTitle')),
        I18n.t(ext('manualApprovalMessage')),
        [
          {
            text: 'OK',
            onPress: () => {
              store.dispatch(clearAuthState()).then(() => {
                if (callback) {
                  callback();
                }
              });
            },
          },
        ],
        { cancelable: false },
      );
    }

    return next(action);
  },
  priorities.AUTH,
);
