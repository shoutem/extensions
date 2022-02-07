import { ext } from 'context';
import { combineReducers } from 'redux';
import { one } from '@shoutem/redux-io';

export const SHORTCUTS = 'shoutem.core.shortcuts';

export default combineReducers({
  shortcut: one(SHORTCUTS, ext('shortcut')),
});
