import { url, appId } from 'environment';
import { find } from '@shoutem/redux-io';
import { ext } from 'context';
import { CHANNELS } from '../types';

export function loadLanguages() {
  const params = {
    isLanguage: true,
  };

  const config = {
    schema: CHANNELS,
    request: {
      endpoint: `//${url.legacy}/${appId}/channels/objects/channels`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('all-languages'), params);
}
