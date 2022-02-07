import React from 'react';
import { AppState } from 'react-native';
import rio from '@shoutem/redux-io';
import {
  getAppId,
  getExtensionSettings,
  setQueueTargetComplete,
} from 'shoutem.application';
import { getCurrentRoute } from 'shoutem.navigation';
import { authProviders } from './services/authProviders';
import { shoutemApi } from './services/shoutemApi';
import { ext } from './const';
import { AuthProvider } from './providers';
import {
  AUTH_TOKEN_SCHEMA,
  fetchUser,
  getAccessToken,
  getUser,
  hideShortcuts,
  isAuthenticated,
  LOGOUT,
  restoreSession,
  USER_SCHEMA,
} from './redux';
import { getSession } from './session';

async function refreshUser(dispatch, getState) {
  const session = await getSession();

  if (session) {
    dispatch(restoreSession(session));
  }

  const accessToken = getAccessToken(getState());

  if (accessToken) {
    try {
      await dispatch(fetchUser('me'));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error fetching user 'me': ", e);
      dispatch({ type: LOGOUT });
    }
  }

  const state = getState();

  if (isAuthenticated(state)) {
    const user = getUser(state);

    dispatch(hideShortcuts(user));
  }

  dispatch(setQueueTargetComplete(ext()));
  return null;
}

const createHandleAppStateChange = (dispatch, getState) => appState => {
  const activeRoute = getCurrentRoute();

  if (appState === 'active' && activeRoute?.name !== ext('EditProfileScreen')) {
    refreshUser(dispatch, getState);
  }
};

let handleAppStateChange;

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const { dispatch, getState } = store;

  const appId = getAppId();

  const { authApiEndpoint, providers } = getExtensionSettings(state, ext());

  const providerKeys = Object.keys(providers);

  // TODO: Set up proper provider objects for Apple and Facebook authentication.
  // Twitter and "email" providers will receive dummy / name only providers.
  // Email is our own provider and we have to add it because we use it to
  // determine whether or not the privacy policy and ToS should be displayed.
  // Twitter cannot be enabled by app owners.
  providerKeys.forEach(key => {
    if (providers[key].enabled) {
      authProviders.addProvider({ name: ext(`provider.${key}`) });
    } else {
      authProviders.removeProvider(ext(`provider.${key}`));
    }
  });

  if (!authApiEndpoint) {
    // eslint-disable-next-line no-console
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

export function renderProvider(children) {
  return <AuthProvider content={children} />;
}
