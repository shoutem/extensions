import _ from 'lodash';
import ext from 'src/const';
import { getExtension } from '@shoutem/redux-api-sdk';
import { find, update } from '@shoutem/redux-io';
import { APPS } from '../const';

export function loadApp(extName, appId) {
  return (dispatch, getState) => {
    const state = getState();

    const extension = getExtension(state, extName);
    const cloudUrl = _.get(extension, 'settings.services.self.cloud');

    const config = {
      schema: APPS,
      request: {
        endpoint: `${cloudUrl}/v1/apps/${appId}`,
        headers: {
          Accept: 'application/vnd.api+json',
        },
      },
    };

    return dispatch(find(config, ext('app')));
  };
}

export function updateApp(extName, appId, attributes) {
  return (dispatch, getState) => {
    const state = getState();

    const extension = getExtension(state, extName);
    const cloudUrl = _.get(extension, 'settings.services.self.cloud');

    const config = {
      schema: APPS,
      request: {
        endpoint: `${cloudUrl}/v1/apps/${appId}`,
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      },
    };

    const item = {
      type: APPS,
      attributes: {
        ...attributes,
      },
    };

    return dispatch(update(config, item, ext('app')));
  };
}
