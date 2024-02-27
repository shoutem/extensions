import { createScopedReducer } from '@shoutem/redux-api-sdk';
import appReducer, { moduleName as app } from './modules/app';

// REDUCER
export const reducer = () =>
  createScopedReducer({
    extension: {
      [app]: appReducer,
    },
  });
