import { combineReducers } from 'redux';
import Uri from 'urijs';
import { storage, update } from '@shoutem/redux-io';
import { url, appId, auth } from 'environment';
import iconsPageReducer from './iconsPage/actions';

export const SHORTCUTS = 'shoutem.core.shortcuts';

const storageReducer = combineReducers({
  [SHORTCUTS]: storage(SHORTCUTS),
});

export default combineReducers({
  iconsPage: iconsPageReducer,
  storage: storageReducer,
});

export function updateShortcut(shortcut) {
  const uri = new Uri()
    .protocol('')
    .host(url.apps)
    .segment(['v1', 'apps', appId, 'shortcuts', shortcut.id])
    .toString();

  const config = {
    endpoint: uri,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${auth.token}`,
    },
  };

  return update(config, SHORTCUTS, {
    type: SHORTCUTS,
    ...shortcut,
  });
}
