import rio from '@shoutem/redux-io';
import { getExtensionSettings } from 'shoutem.application';

import {
  ext,
  AUTHORIZATIONS_SCHEMA,
  CARD_SCHEMA,
  CARD_STATE_SCHEMA,
  PUNCHCARDS_SCHEMA,
  REWARDS_SCHEMA,
  TRANSACTIONS_SCHEMA,
} from './const';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const { apiEndpoint, programId } = getExtensionSettings(state, ext());

  const programEndpoint = `http://${apiEndpoint}/v1/programs/${programId}`;

  const jsonApiRequestOptions = {
    headers: {
      'Accept': 'application/vnd.api+json',
    },
  };

  rio.registerSchema({
    schema: CARD_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cards{user}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: CARD_STATE_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cards/{cardId}/point-state`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: AUTHORIZATIONS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/authorizations/verify`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  });

  rio.registerSchema({
    schema: PUNCHCARDS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rewards/punch`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: REWARDS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rewards/point`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: TRANSACTIONS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/transactions`,
      ...jsonApiRequestOptions,
    },
  });

  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
}
