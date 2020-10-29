import { find } from '@shoutem/redux-io';
import { shoutemUrls } from 'src/services';
import { ext } from 'src/const';
import { CHANNELS, CHANNELS_MODULE_TYPE } from '../const';

export function enableChannelsModule(appId) {
  const data = { module_type: CHANNELS_MODULE_TYPE };

  const config = {
    schema: CHANNELS,
    request: {
      endpoint: shoutemUrls.legacyApi(
        `api/application/module/activate?nid=${appId}`,
      ),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify(data),
    },
  };

  return find(config, ext('enable-channels'));
}

export function createChannel(appId, data) {
  const config = {
    schema: CHANNELS,
    request: {
      endpoint: shoutemUrls.legacyApi(`${appId}/channels/objects/channels`),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify(data),
    },
  };

  return find(config, ext('create-channel'));
}

export function updateChannel(appId, channelId, data) {
  const config = {
    schema: CHANNELS,
    request: {
      endpoint: shoutemUrls.legacyApi(
        `${appId}/channels/objects/channels/${channelId}`,
      ),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify(data),
    },
  };

  return find(config, ext('update-channel'));
}

export function deleteChannel(appId, channelId) {
  const config = {
    schema: CHANNELS,
    request: {
      endpoint: shoutemUrls.legacyApi(
        `${appId}/channels/objects/channels/${channelId}`,
      ),
      method: 'DELETE',
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('delete-channel'));
}
