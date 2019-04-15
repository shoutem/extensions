import _ from 'lodash';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore as createReduxStore,
} from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import {
  assertNotEmpty,
  extractFlattenedNamedExports,
  extractNamedExports,
  prioritizeItems,
  priorities,
  setPriority,
} from 'shoutem-core';
import {
  apiStateMiddleware,
  enableRio,
} from '@shoutem/redux-io';
import {
  middleware as reduxMiddleware,
} from '../redux';

/**
 * Creates a redux store using the reducers from the extensions.
 * The store will contain the extension keys on the root level,
 * where each of those keys will be handled by the extensions
 * reducer, e.g.:
 * {
 *  extension1: extension1.reducer,
 *  extension2: extension2.reducer,
 *  ...
 * }
 * @param appContext The context configured through the builder API
 * @returns {*} The created redux store.
 */
export function createStore(app) {
  const extensions = app.getExtensions();
  const extensionReducers = extractNamedExports(extensions, 'reducer');

  /**
   * @Davor Grubelic: This is only temporary solution because current implementation of Shoutem's
   * navigation system requires core reducer and state. This reducer was placed in "shoutem.core"
   * extension, but it caused circular dependency due to imports from "shoute.redux" and
   * "shoutem.navigation" extensions.
   */

  assertNotEmpty(extensionReducers, 'At least one reducer must be available in order to create Redux store');

  const extensionEnhancers = extractFlattenedNamedExports(extensions, 'enhancers');
  const storeReducers = {
    ...extensionReducers,
  };

  // Configure some shared libraries by default
  const reducer = enableRio(combineReducers(storeReducers), {
    useModificationCache: false
  });
  const extensionMiddleware = extractFlattenedNamedExports(extensions, 'middleware');
  const middleware = [
    setPriority(thunk, priorities.INIT),
    setPriority(apiMiddleware, priorities.NETWORKING),
    setPriority(apiStateMiddleware, priorities.NETWORKING),
    ...reduxMiddleware,
    ...extensionMiddleware,
  ];
  const prioritizedMiddleware = prioritizeItems(middleware);

  const enhancers = compose(
    ...extensionEnhancers,
    // Composes functions from right to left. Middleware should be first in execution in order to
    // get clean dispatch and store.
    applyMiddleware(
      ...prioritizedMiddleware,
    ),
  );

  return createReduxStore(reducer, enhancers);
}
