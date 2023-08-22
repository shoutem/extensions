import { AppState, Platform } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import rio from '@shoutem/redux-io';
import {
  getAppId,
  getExtensionServiceUrl,
  getExtensionSettings,
  setQueueTargetComplete,
} from 'shoutem.application';
import { getCurrentRoute } from 'shoutem.navigation';
import { cancelPendingJourney } from 'shoutem.notification-center';
import {
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import { isPreviewApp } from 'shoutem.preview';
import { authProviders } from './services/authProviders';
import { shoutemApi } from './services/shoutemApi';
import { COMPLETE_REGISTRATION_TRIGGER, ext } from './const';
import {
  AUTH_TOKEN_SCHEMA,
  fetchUser,
  getAccessToken,
  getUser,
  hideShortcuts,
  isAuthenticated,
  LOGOUT,
  restoreSession,
  triggerCompleteRegistration,
  USER_SCHEMA,
} from './redux';
import { getSession } from './session';

let appStateListener;
let previousAppState = 'active';

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

  if (appState === 'active') {
    dispatch(cancelPendingJourney(COMPLETE_REGISTRATION_TRIGGER));

    const state = getState();
    const { trackFbsdkEvents } = getExtensionSettings(state, ext());

    if (trackFbsdkEvents && !isPreviewApp) {
      if (Platform.OS === 'ios') {
        const TRACKING_PERMISSION =
          PERMISSION_TYPES.IOS_APP_TRACKING_TRANSPARENCY;

        requestPermissions(TRACKING_PERMISSION).then(result => {
          if (result[TRACKING_PERMISSION] === RESULTS.GRANTED) {
            Settings.setAdvertiserTrackingEnabled(true);
          }
        });
      } else {
        Settings.setAdvertiserTrackingEnabled(true);
      }
    }
  }

  if (appState.match(/inactive|background/) && previousAppState === 'active') {
    dispatch(triggerCompleteRegistration());
  }

  previousAppState = appState;
};

let handleAppStateChange;

export async function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const { dispatch, getState } = store;

  const appId = getAppId();

  const { providers, trackFbsdkEvents } = getExtensionSettings(state, ext());

  if (trackFbsdkEvents) {
    const TRACKING_PERMISSION = PERMISSION_TYPES.IOS_APP_TRACKING_TRANSPARENCY;

    if (Platform.OS === 'ios') {
      requestPermissions(TRACKING_PERMISSION).then(async result => {
        if (result[TRACKING_PERMISSION] === RESULTS.GRANTED) {
          Settings.setAdvertiserTrackingEnabled(true);
        }
      });
    } else {
      Settings.setAdvertiserTrackingEnabled(true);
    }
  }

  const authApiEndpoint = getExtensionServiceUrl(state, ext(), 'auth');

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
    console.error('Could not find auth service endpoint.');
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
  appStateListener = AppState.addEventListener('change', handleAppStateChange);

  return refreshUser(dispatch, getState);
}

export function appWillUnmount() {
  appStateListener.remove();
}
