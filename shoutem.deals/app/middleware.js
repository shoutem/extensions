import _ from 'lodash';
import URI from 'urijs';

import { isRSAA, RSAA } from 'redux-api-middleware';

import { priorities, setPriority, before } from 'shoutem-core';
import { getExtensionServiceUrl } from 'shoutem.application';
import { getAccessToken } from 'shoutem.auth';

import { ext, AUTH_HEADERS } from './const';

function getAuthHeader(state) {
  return `Bearer ${getAccessToken(state)}`;
}

export const networkRequestMiddleware = setPriority(
  store => next => action => {
    if (isRSAA(action)) {
      const state = store.getState();

      const dealsApiEndpoint = getExtensionServiceUrl(state, ext(), 'deals');
      const endpointDomain = new URI(action[RSAA].endpoint).domain();

      if (
        dealsApiEndpoint === endpointDomain &&
        !_.has(action[RSAA], AUTH_HEADERS)
      ) {
        _.set(action[RSAA], AUTH_HEADERS, getAuthHeader(state));
      }
    }

    return next(action);
  },
  before(priorities.NETWORKING),
);
