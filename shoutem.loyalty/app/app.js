import _ from 'lodash';
import rio from '@shoutem/redux-io';
import {
  getExtensionServiceUrl,
  getExtensionSettings,
} from 'shoutem.application';
import {
  AUTHORIZATIONS_SCHEMA,
  CARD_SCHEMA,
  CARD_STATE_SCHEMA,
  CASHIERS_SCHEMA,
  ext,
  POINT_REWARDS_SCHEMA,
  PUNCH_REWARDS_SCHEMA,
  RULES_SCHEMA,
  TRANSACTIONS_SCHEMA,
} from './const';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const { program } = getExtensionSettings(state, ext());
  const apiEndpoint = getExtensionServiceUrl(state, ext(), 'loyalty');
  const programId = _.get(program, 'id');

  const programEndpoint = `${apiEndpoint}/v1/programs/${programId}`;

  const jsonApiRequestOptions = {
    headers: {
      Accept: 'application/vnd.api+json',
    },
  };

  rio.registerResource({
    schema: CARD_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cards/{user}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerResource({
    schema: CARD_STATE_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cards/{cardId}/state?filter[cardType]=point`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerResource({
    schema: CASHIERS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cashiers/user:{userId}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerResource({
    schema: AUTHORIZATIONS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/authorizations/verify`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  });

  rio.registerResource({
    schema: PUNCH_REWARDS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rewards/punch{?query*}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerResource({
    schema: POINT_REWARDS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rewards/point{?query*}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerResource({
    schema: RULES_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rules`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerResource({
    schema: TRANSACTIONS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/transactions{?query*}`,
      ...jsonApiRequestOptions,
    },
  });
}
