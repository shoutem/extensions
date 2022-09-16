import shopifyReducer, { moduleName as shopify } from 'src/modules/shopify';
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

// REDUCER
export default createScopedReducer({
  extension: {
    [shopify]: shopifyReducer,
  },
});
