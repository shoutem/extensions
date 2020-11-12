import { storage, collection } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import { SHOUTEM_MODULES } from '../const';

export default combineReducers({
  modules: storage(SHOUTEM_MODULES),
  appModules: collection(SHOUTEM_MODULES, 'app'),
});
