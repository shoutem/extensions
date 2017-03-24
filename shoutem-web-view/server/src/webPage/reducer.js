import { combineReducers } from 'redux';
import { one, update } from '@shoutem/redux-io';
import { url, appId } from 'environment';

export const SHORTCUTS = 'shoutem.core.shortcuts';

export default combineReducers({
  shortcut: one(SHORTCUTS, 'shortcut'),
});

export function updateShortcutSettings(id, settings) {
  const config = {
    schema: SHORTCUTS,
    request: {
      endpoint: `//${url.apps}/v1/apps/${appId}/shortcuts/${id}`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const partialShortcut = {
    type: SHORTCUTS,
    id,
    attributes: {
      settings,
    },
  };

  return update(config, partialShortcut);
}
