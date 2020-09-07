import { find } from '@shoutem/redux-io';
import { SHOUTEM_MODULES } from '../const';
import { shoutemUrls } from '../services';

const CHAT_MODULE = {
  data: {
    type: SHOUTEM_MODULES,
    attributes: {
      name: 'shoutem.sendbird'
    }
  }
};

export function loadAppModules(appId) {
  const config = {
    schema: SHOUTEM_MODULES,
    request: {
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/modules`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'app');
}

export function activateChatModule(appId) {
  const config = {
    schema: SHOUTEM_MODULES,
    request: {
      method: 'POST',
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/modules`),
      headers: {
        Accept: 'application/vnd.api+json',
        "Content-Type": "application/vnd.api+json"
      },
      body: JSON.stringify(CHAT_MODULE),
    },
  };

  return find(config, 'activate-module');
}
