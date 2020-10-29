import { create } from '@shoutem/redux-io';
import { shoutemUrls } from './services';

const APPLICATION_BUILD_INVALIDATE_ACTIONS =
  'shoutem.core.build-invalidate-actions';

export function invalidateCurrentBuild(appId) {
  const item = {
    type: APPLICATION_BUILD_INVALIDATE_ACTIONS,
    attributes: {},
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

export function navigateToUrl(url) {
  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: {
      component: 'external',
      options: { url },
    },
  };
}
