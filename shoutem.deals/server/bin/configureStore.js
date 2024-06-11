import _ from 'lodash';
import { applyMiddleware, compose, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import { apiStateMiddleware, enableRio } from '@shoutem/redux-io';
import {
  enableStateSync,
  syncStateEngineMiddleware,
} from '@shoutem/redux-sync-state-engine';
import * as extension from '../src/index';
import { createRootReducer } from './reducers';

export default function configureStore(context, initialState, syncStateEngine) {
  const middlewareList = [
    thunk,
    apiMiddleware,
    apiStateMiddleware,
    syncStateEngineMiddleware(syncStateEngine),
  ];
  const middleware = compose(applyMiddleware(...middlewareList));

  const extensionName = context.ownExtensionName;
  const reducer = _.get(extension, 'reducer');
  const rootReducer = enableRio(createRootReducer(extensionName, reducer));
  const syncRootReducer = enableStateSync(rootReducer, syncStateEngine);
  const store = middleware(createStore)(syncRootReducer, initialState);

  return store;
}
