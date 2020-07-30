import _ from 'lodash';
import { getExtension } from '@shoutem/redux-api-sdk';
import { create, find, remove } from '@shoutem/redux-io';
import ext from 'src/const';
import { RSS_MONITORS } from '../const';

export function loadRssMonitor(extName, appId) {
  return (dispatch, getState) => {
    const state = getState();

    const extension = getExtension(state, extName);
    const cloudUrl = _.get(extension, 'settings.services.self.cloud');

    const config = {
      schema: RSS_MONITORS,
      request: {
        endpoint: `${cloudUrl}/v1/monitors/app:${appId}`,
        headers: {
          Accept: 'application/vnd.api+json',
        },
      },
    };

    return dispatch(find(config, ext('monitor')));
  };
}

export function enableMonitoring(extName, appId) {
  return (dispatch, getState) => {
    const state = getState();

    const extension = getExtension(state, extName);
    const cloudUrl = _.get(extension, 'settings.services.self.cloud');

    const config = {
      schema: RSS_MONITORS,
      request: {
        endpoint: `${cloudUrl}/v1/monitors`,
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      },
    };

    const item = {
      type: RSS_MONITORS,
      attributes: {
        appId,
      },
    };

    return dispatch(create(config, item, ext('monitor')));
  };
}

export function disableMonitoring(extName, appId, monitor) {
  return (dispatch, getState) => {
    const state = getState();

    const extension = getExtension(state, extName);
    const cloudUrl = _.get(extension, 'settings.services.self.cloud');

    const config = {
      schema: RSS_MONITORS,
      request: {
        endpoint: `${cloudUrl}/v1/monitors/app:${appId}`,
        headers: {
          Accept: 'application/vnd.api+json',
        },
      },
    };

    return dispatch(remove(config, monitor));
  };
}
