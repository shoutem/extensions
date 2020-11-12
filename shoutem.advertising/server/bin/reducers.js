import { combineReducers } from 'redux';
import { reducer as coreReducer } from '@shoutem/redux-api-sdk';

export function createRootReducer(extensionName, reducer) {
  if (!reducer) {
    return combineReducers({
      core: coreReducer,
    });
  }

  return combineReducers({
    core: coreReducer,
    [extensionName]: reducer,
  });
}
