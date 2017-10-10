import { createScopedReducer } from '@shoutem/redux-api-sdk';

export function navigateToExtension(options) {
  const { appId, canonicalName, installationId } = options;
  if (!appId) {
    throw new Error('Cannot navigate to extension: no appId!');
  }

  if (!canonicalName && !installationId) {
    throw new Error(
      'Cannot navigate to extension: installationId or extension name must be provided'
    );
  }

  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: {
      component: 'extension',
      options,
    },
  };
}

export default () => (
  createScopedReducer({
    extension: {
      // Example of custom reducers
      test: () => new Date().getMinutes(),
    },
  })
);
