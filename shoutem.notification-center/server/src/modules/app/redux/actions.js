import ext from 'src/const';
import { shoutemUrls } from 'src/services';
import { find } from '@shoutem/redux-io';
import { APPLICATION_STATUS } from '../const';

export function loadApplicationStatus(appId) {
  const config = {
    schema: APPLICATION_STATUS,
    request: {
      endpoint: shoutemUrls.appsApi(`v1/apps/${appId}/status`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('status'));
}
