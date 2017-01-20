import { combineReducers } from 'redux';
import { apiStateMiddleware, storage, one, collection, find, update } from '@shoutem/redux-io';
import {url, appId, auth } from 'environment';
import { ext } from 'context';

export const SHORTCUTS = 'shoutem.core.shortcuts';

export default combineReducers({
  shortcuts: collection(SHORTCUTS, ext('shortcuts'))
});

export function loadShortcuts() {
  const config = {
    schema: SHORTCUTS,
    request: {
      endpoint: `//${url.apps}/v1/apps/${appId}/shortcuts`,
      headers: {
        'Accept': 'application/vnd.api+json',
        Authorization: `Bearer ${auth.token}`
      },
    }
  };

  return find(config, ext('shortcuts'));
}
