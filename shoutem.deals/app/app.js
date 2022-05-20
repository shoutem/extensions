import _ from 'lodash';
import URI from 'urijs';
import rio from '@shoutem/redux-io';
import { getExtensionServiceUrl } from 'shoutem.application';
import {
  ext,
  // APPLICATION_EXTENSION,

  // Schemes
  // DEALS_SCHEMA,
  REDEEM_DEAL_SCHEMA,
  REDEEM_COUPON_SCHEMA,
  CLAIM_COUPON_SCHEMA,
  DEAL_TRANSACTIONS_SCHEMA,
  TRANSACTIONS_SCHEMA,

  // Paths
  REDEEM_DEAL_PATH,
  REDEEM_COUPON_PATH,
  CLAIM_COUPON_PATH,
  DEAL_TRANSACTIONS_PATH,
  TRANSACTIONS_PATH,
} from './const';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const dealsApiEndpoint = getExtensionServiceUrl(state, ext(), 'deals');

  function createDealsApiEndpoint(path, params) {
    const endpoint = new URI(`${dealsApiEndpoint}/v1/${path}`);
    endpoint.protocol('https');

    if (!_.isEmpty(params)) {
      endpoint.setQuery(params);
    }

    return endpoint.readable();
  }

  rio.registerResource({
    schema: TRANSACTIONS_SCHEMA,
    request: {
      endpoint: createDealsApiEndpoint(TRANSACTIONS_PATH),
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });

  rio.registerResource({
    schema: DEAL_TRANSACTIONS_SCHEMA,
    request: {
      endpoint: createDealsApiEndpoint(DEAL_TRANSACTIONS_PATH),
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });

  rio.registerResource({
    schema: REDEEM_DEAL_SCHEMA,
    request: {
      endpoint: createDealsApiEndpoint(REDEEM_DEAL_PATH),
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  });

  rio.registerResource({
    schema: CLAIM_COUPON_SCHEMA,
    request: {
      endpoint: createDealsApiEndpoint(CLAIM_COUPON_PATH),
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  });

  rio.registerResource({
    schema: REDEEM_COUPON_SCHEMA,
    request: {
      endpoint: createDealsApiEndpoint(REDEEM_COUPON_PATH),
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  });
}
