import rio from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application/app';
import {
  getExtensionCloudUrl,
  getExtensionServiceUrl,
  getExtensionSettings,
} from 'shoutem.application/redux';
import { getUser, isAuthenticated } from 'shoutem.auth';
import { Firebase } from 'shoutem.firebase';
import { shoutemApi } from './services/shoutemApi';
import { ext, SOCIAL_SETTINGS_SCHEMA, STATUSES_SCHEMA } from './const';
import { initUserSettings } from './redux';

const APPLICATION_EXTENSION = 'shoutem.application';
const AUTH_EXTENSION = 'shoutem.auth';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const apiEndpoint = getExtensionSettings(state, APPLICATION_EXTENSION)
    .legacyApiEndpoint;
  const cloudHost = getExtensionCloudUrl(state, ext());
  const appsHost = getExtensionServiceUrl(state, APPLICATION_EXTENSION, 'apps');

  const { authApiEndpoint } = getExtensionSettings(state, AUTH_EXTENSION);
  if (!authApiEndpoint) {
    console.error(`Authentication API endpoint not set in ${ext()} settings.`);
  }

  const appId = getAppId();
  shoutemApi.init(apiEndpoint, authApiEndpoint, cloudHost, appsHost, appId);

  const apiRequestOptions = {
    resourceType: 'JSON',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  rio.registerResource({
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: '',
      ...apiRequestOptions,
    },
  });

  rio.registerResource({
    schema: SOCIAL_SETTINGS_SCHEMA,
    request: {
      endpoint: shoutemApi.buildCloudUrl(
        '/v1/users/legacyId:{userId}/settings/{settingsId}',
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
    actions: {
      create: {
        request: {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
      },
      update: {
        request: {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        },
      },
    },
  });
}

export function appDidFinishLaunching(app) {
  const store = app.getStore();
  const state = store.getState();
  const isLoggedIn = isAuthenticated(state);
  const user = getUser(state);

  if (isLoggedIn) {
    const firebaseTopic = `user.${user.legacyId}`;

    Firebase.subscribeToTopic(firebaseTopic);
    store.dispatch(initUserSettings(user.legacyId));
  }
}
