import { url, appId } from 'environment';
import { find } from '@shoutem/redux-io';
import { ext } from 'context';
import { CHANNELS, LANGUAGE_MODULE_STATUS } from '../types';

const CHANNEL_MODULE_TYPE = 38;

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

export function loadLanguageModuleStatus() {
  const config = {
    schema: LANGUAGE_MODULE_STATUS,
    request: {
      endpoint: `//${url.legacy}/api/application/module/status?nid=${appId}&module_type=${CHANNEL_MODULE_TYPE}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('language-module'));
}
