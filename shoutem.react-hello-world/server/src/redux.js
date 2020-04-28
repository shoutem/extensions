import { createScopedReducer } from '@shoutem/redux-api-sdk';

export default () => (
  createScopedReducer({
    extension: {
      // Example of custom reducers
      test: () => new Date().getMinutes(),
    },
  })
);
