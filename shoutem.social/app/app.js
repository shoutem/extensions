import rio from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application/app';
import {
  getExtensionCloudUrl,
  getExtensionServiceUrl,
} from 'shoutem.application/redux';
import { getUser, isAuthenticated } from 'shoutem.auth';
import { Firebase } from 'shoutem.firebase';
import { shoutemApi } from './services/shoutemApi';
import { ext, SOCIAL_SETTINGS_SCHEMA, STATUSES_SCHEMA } from './const';
import { initUserSettings } from './redux';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const apiEndpoint = getExtensionServiceUrl(state, ext(), 'cms');
  const appsEndpoint = getExtensionServiceUrl(state, ext(), 'apps');
  const authApiEndpoint = getExtensionServiceUrl(state, ext(), 'auth');
  const cloudHost = getExtensionCloudUrl(state, ext());

  if (!authApiEndpoint) {
    // eslint-disable-next-line no-console
    console.error('Could not find auth API endpoint.');
  }

  const appId = getAppId();
  shoutemApi.init(apiEndpoint, authApiEndpoint, cloudHost, appsEndpoint, appId);

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
