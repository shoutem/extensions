import { createScopedReducer } from '@shoutem/redux-api-sdk';
import appReducer, { moduleName as app } from './modules/app';
import rssReducer, { moduleName as rss } from './modules/rss';

// REDUCER
export const reducer = () =>
  createScopedReducer({
    extension: {
      [app]: appReducer,
      [rss]: rssReducer,
    },
  });
