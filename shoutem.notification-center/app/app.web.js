import rio from '@shoutem/redux-io';
import { getAppId, getExtensionServiceUrl } from 'shoutem.application';
import { priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import getEndpointProvider, { initialize } from './EndpointProvider';
import {
  fetchGroups,
  GROUPS_SCHEMA,
  NOTIFICATIONS_SCHEMA,
  SCHEDULED_NOTIFICATIONS_SCHEMA,
  SELECTED_GROUPS_SCHEMA,
} from './redux';

const apiRequestOptions = {
  resourceType: 'JSON',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const appDidMount = setPriority(async app => {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  const legacyApiEndpoint = getExtensionServiceUrl(state, ext(), 'cms');

  if (!legacyApiEndpoint) {
    throw new Error('Core service endpoints not found.');
  }

  initialize(legacyApiEndpoint, appId);

  rio.registerResource({
    schema: NOTIFICATIONS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().inbox,
      ...apiRequestOptions,
    },
  });

  rio.registerResource({
    schema: GROUPS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().groups,
      ...apiRequestOptions,
    },
  });

  rio.registerResource({
    schema: SELECTED_GROUPS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().selectedGroups,
      ...apiRequestOptions,
    },
  });

  rio.registerResource({
    schema: SCHEDULED_NOTIFICATIONS_SCHEMA,
    request: {
      endpoint: `${getEndpointProvider().scheduledNotifications}?type=manual`,
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });

  const { dispatch } = store;

  dispatch(fetchGroups());
}, priorities.FIRST);
