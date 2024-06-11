import { ext } from 'src/const';
import { find } from '@shoutem/redux-io';
import { CHANNELS, LANGUAGE_MODULE_STATUS } from '../const';
import { languagesApi } from '../services';

const CHANNEL_MODULE_TYPE = 38;

export function loadLanguages(appId) {
  const params = {
    q: {
      isLanguage: true,
    },
  };

  const config = {
    schema: CHANNELS,
    request: {
      endpoint: languagesApi.buildUrl(
        `${appId}/channels/objects/channels{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('all-languages'), params);
}

export function loadLanguageModuleStatus(appId) {
  const config = {
    schema: LANGUAGE_MODULE_STATUS,
    request: {
      endpoint: languagesApi.buildUrl(
        `/api/application/module/status?nid=${appId}&module_type=${CHANNEL_MODULE_TYPE}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('language-module'));
}
