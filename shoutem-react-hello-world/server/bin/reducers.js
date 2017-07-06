import _ from 'lodash';
import { combineReducers } from 'redux';
import {
  reducer as coreReducer,
} from '@shoutem/api';

export function createRootReducer(extensionName, reducer) {
  return combineReducers({
    core: coreReducer,
    [extensionName]: reducer,
  });
}
