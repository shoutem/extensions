import { ext } from 'src/const';
import { shoutemUrls } from 'src/services';
import { create, find, remove, update } from '@shoutem/redux-io';
import { FONTS } from '../const';

export function loadAllFonts(appId) {
  const config = {
    schema: FONTS,
    request: {
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/fonts/all`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('all'));
}

export function createFont(appId, attributes) {
  const config = {
    schema: FONTS,
    request: {
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/fonts`),
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const data = {
    type: FONTS,
    attributes,
  };

  return create(config, data);
}

export function updateFont(appId, fontId, attributes) {
  const config = {
    schema: FONTS,
    request: {
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/fonts/${fontId}`),
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const data = {
    type: FONTS,
    id: fontId,
    attributes,
  };

  return update(config, data);
}

export function removeFont(appId, fontId) {
  const config = {
    schema: FONTS,
    request: {
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/fonts/${fontId}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return remove(config, {
    type: FONTS,
    id: fontId,
  });
}
