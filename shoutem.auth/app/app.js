import { AppState } from 'react-native';
import URI from 'urijs';

import rio from '@shoutem/redux-io';
import { getAppId, getExtensionSettings } from 'shoutem.application';

import {
  USER_SCHEMA,
  USER_FACEBOOK_CREDENTIALS_SCHEMA,
  AUTH_TOKEN_SCHEMA,
  fetchUser,
  restoreSession,
  getAccessToken,
  isAuthenticated,
  getUser,
  hideShortcuts,
} from './redux';

import { getSession } from './session';
import { ext } from './const';

const APPLICATION_EXTENSION = 'shoutem.application';

function refreshUser(dispatch, getState) {
  return getSession()
    .then(session => session && dispatch(restoreSession(session)))
    .then(() => getAccessToken(getState()) && dispatch(fetchUser('me')))
    .then(() => {
      const state = getState();
      if (isAuthenticated(state)) {
        const settings = getExtensionSettings(state, ext());
        const user = getUser(state);

        return dispatch(hideShortcuts(user, settings));
      }
    });
}

const createHandleAppStateChange = (dispatch, getState) => (appState) => {
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

  const apiEndpoint = getExtensionSettings(state, APPLICATION_EXTENSION).legacyApiEndpoint;
  const authApiEndpoint = getExtensionSettings(state, ext()).authApiEndpoint;

  if (!authApiEndpoint) {
    console.error(`Authentication API endpoint not set in ${ext()} settings.`);
  }

  function createAccountApiEndpoint(path, queryStringParams) {
    const endpoint = new URI(`${apiEndpoint}/api/account/${path}`);

    return endpoint
      .protocol('https')
      .query(`${queryStringParams}&nid=${appId}`)
      .readable();
  }

  function createAuthApiEndpoint(path, queryStringParams = '') {
    const endpoint = new URI(`${authApiEndpoint}/v1/realms/externalReference:${appId}/${path}`);

    return endpoint
      .protocol('https')
      .query(`${queryStringParams}`)
      .readable();
  }

  rio.registerResource({
    schema: USER_SCHEMA,
    request: {
      endpoint: createAuthApiEndpoint('users/{userId}'),
      headers: {
        accept: 'application/vnd.api+json',
      },
    },
    actions: {
      create: {
        request: {
          endpoint: createAuthApiEndpoint('users'),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
      },
      update: {
        request: {
          endpoint: createAuthApiEndpoint('users/{userId}'),
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
      endpoint: createAuthApiEndpoint('tokens'),
      headers: {
        accept: 'application/vnd.api+json',
      },
    },
    actions: {
      create: {
        request: {
          endpoint: createAuthApiEndpoint('tokens'),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
      },
    },
  });

  rio.registerResource({
    schema: USER_FACEBOOK_CREDENTIALS_SCHEMA,
    request: {
      endpoint: createAccountApiEndpoint(
        'verify_facebook_credentials.json',
        'access_token={accessToken}&auto_register=true&update_shoutem_profile=false',
      ),
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/json',
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
