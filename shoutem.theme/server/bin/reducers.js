import { combineReducers } from 'redux';
import { reducer as coreReducer } from '@shoutem/redux-api-sdk';
import { reducer as formReducer } from '@shoutem/react-form-builder';

export function createRootReducer(extensionName, reducer) {
  return combineReducers({
    core: coreReducer,
    [extensionName]: reducer,
    form: formReducer,
  });
}
