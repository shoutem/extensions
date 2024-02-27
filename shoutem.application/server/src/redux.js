import { createScopedReducer } from '@shoutem/redux-api-sdk';
import analyticsReducer, { moduleName as analytics } from './modules/analytics';

// REDUCER
export const reducer = () =>
  createScopedReducer({
    extension: {
      [analytics]: analyticsReducer,
    },
  });
