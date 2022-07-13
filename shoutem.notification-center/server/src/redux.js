import _ from 'lodash';
import { reducer as formReducer } from 'redux-form';
import { createScopedReducer } from '@shoutem/redux-api-sdk';
import { create } from '@shoutem/redux-io';
import appReducer, { moduleName as app } from './modules/app';
import groupReducer, { moduleName as group } from './modules/groups';
import notificationJourneyReducer, {
  moduleName as notificationJourneys,
} from './modules/notification-journeys';
import notificationReducer, {
  moduleName as notification,
} from './modules/notifications';
import ext from './const';
import { shoutemUrls } from './services';

const APPLICATION_BUILD_INVALIDATE_ACTIONS =
  'shoutem.core.build-invalidate-actions';

function getExtensionState(state) {
  return _.get(state, ext(), {});
}

export function getFormState(state) {
  const extensionState = getExtensionState(state);
  return extensionState.form;
}

export function invalidateCurrentBuild(appId) {
  const item = {
    type: APPLICATION_BUILD_INVALIDATE_ACTIONS,
    attributes: {
      // Be aware when testing/debugging!
      // This is preparation for server part, it's not implemented yet.
      buildType: 'production',
    },
  };

  const config = {
    schema: APPLICATION_BUILD_INVALIDATE_ACTIONS,
    request: {
      endpoint: shoutemUrls.appsApi(
        `v1/apps/${appId}/configurations/current/builds/actions/invalidate`,
      ),
      headers: {
        'Content-Type': 'application/vnd.api+json',
        accept: 'application/vnd.api+json',
      },
    },
  };

  return create(config, item);
}

// REDUCER
export const reducer = () =>
  createScopedReducer({
    extension: {
      form: formReducer,
      [app]: appReducer,
      [notification]: notificationReducer,
      [notificationJourneys]: notificationJourneyReducer,
      [group]: groupReducer,
    },
  });
