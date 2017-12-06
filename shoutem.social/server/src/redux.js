import { createScopedReducer } from '@shoutem/redux-api-sdk';

export function navigateToSettings(appId, sectionId) {
  const options = { appId, sectionId };

  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: {
      component: 'settings',
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
