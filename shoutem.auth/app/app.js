import { AppState } from 'react-native';
import rio from '@shoutem/redux-io';
import { shoutemApi } from './services/shoutemApi';
import { ext } from './const';
import {
  USER_SCHEMA,
  REAUTHENTICATE_FAILED,
  AUTH_TOKEN_SCHEMA,
  fetchUser,
  restoreSession,
  getAccessToken,
  isAuthenticated,
  getUser,
  hideShortcuts,
} from './redux';
import { getSession } from './session';

import { getAppId, getExtensionSettings } from 'shoutem.application';

function refreshUser(dispatch, getState) {
  return getSession()
    .then(session => {
      if (session) {
        return dispatch(restoreSession(session));
      }

      return dispatch({ type: REAUTHENTICATE_FAILED });
    })
    .then(() => getAccessToken(getState()) && dispatch(fetchUser('me')))
    .then(() => {
      const state = getState();
      if (isAuthenticated(state)) {
        const user = getUser(state);

        return dispatch(hideShortcuts(user));
      }

      return null;
    });
}

const createHandleAppStateChange = (dispatch, getState) => appState => {
  if (appState === 'active') {
    refreshUser(dispatch, getState);
  }
};

let handleAppStateChange;

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const { dispatch, getState } = store;

  const appId = getAppId();

  const { authApiEndpoint } = getExtensionSettings(state, ext());

  if (!authApiEndpoint) {
    console.error(`Authentication API endpoint not set in ${ext()} settings.`);
  }

  shoutemApi.init(authApiEndpoint, appId);

  rio.registerResource({
    schema: USER_SCHEMA,
    request: {
      endpoint: shoutemApi.buildAuthUrl('users/{userId}'),
      headers: {
        accept: 'application/vnd.api+json',
      },
    },
    actions: {
      create: {
        request: {
          endpoint: shoutemApi.buildAuthUrl('users'),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
      },
      update: {
        request: {
          endpoint: shoutemApi.buildAuthUrl('users/{userId}'),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
      },
    },
  });

  rio.registerResource({
    schema: AUTH_TOKEN_SCHEMA,
    request: {
      endpoint: shoutemApi.buildAuthUrl('tokens'),
      headers: {
        accept: 'application/vnd.api+json',
      },
    },
    actions: {
      create: {
        request: {
          endpoint: shoutemApi.buildAuthUrl('tokens'),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
      },
    },
  });

  handleAppStateChange = createHandleAppStateChange(dispatch, getState);
  AppState.addEventListener('change', handleAppStateChange);

  return refreshUser(dispatch, getState);
}

export function appWillUnmount() {
  AppState.removeEventListener('change', handleAppStateChange);
}
