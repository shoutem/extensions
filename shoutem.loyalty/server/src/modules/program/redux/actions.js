import _ from 'lodash';
import { find, create, update } from '@shoutem/redux-io';
import { createRule } from 'src/modules/rules';
import { loadResources } from 'src/modules/cms';
import { getLoyaltyUrl, shoutemUrls } from 'src/services';
import ext from 'src/const';
import {
  PROGRAMS,
  PLACES,
  AUTHORIZATIONS,
  CARDS,
  USERS,
} from '../const';

function createProgram(scope) {
  const config = {
    schema: PROGRAMS,
    request: {
      endpoint: getLoyaltyUrl('/v1/programs'),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newProgram = {
    type: PROGRAMS,
    attributes: {
      name: 'My Program',
    },
  };

  return create(config, newProgram, scope);
}

export function createAuthorization(
  programId,
  authorizationData,
  scope = {}
) {
  const config = {
    schema: AUTHORIZATIONS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/authorizations`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const authorization = {
    type: AUTHORIZATIONS,
    attributes: authorizationData,
  };

  return create(config, authorization, scope);
}

export function updateAuthorization(
  programId,
  authorizationId,
  authorizationPatch,
  scope = {},
) {
  const config = {
    schema: AUTHORIZATIONS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/authorizations/${authorizationId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const authorization = {
    type: AUTHORIZATIONS,
    id: authorizationId,
    attributes: authorizationPatch,
  };

  return update(config, authorization, scope);
}

export function loadAuthorizations(programId, scope = {}) {
  const config = {
    schema: AUTHORIZATIONS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/authorizations`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('authorizations'), scope);
}

export function enableLoyalty(
  ruleTemplates,
  authorizationTypes = ['pin', 'userId', 'admin'],
  scope = {}
) {
  return dispatch => (
    dispatch(createProgram(scope))
      .then(action => {
        const programId = _.get(action, ['payload', 'data', 'id']);

        const ruleActions = _.map(ruleTemplates, rule => (
          dispatch(createRule(rule, programId, null, scope))
        ));

        const authActions = _.map(authorizationTypes, authorizationType => {
          const authorization = {
            authorizationType,
            implementationData: {},
          };
          return dispatch(createAuthorization(programId, authorization, scope));
        });

        return Promise.all([
          ...authActions,
          ...ruleActions,
        ]).then(() => programId);
      })
  );
}

export function loadLoyaltyPlaces(appId, categoryId, scope) {
  return loadResources(appId, categoryId, PLACES, {}, PLACES, scope);
}

export function loadCards(programId, scope = {}) {
  const config = {
    schema: CARDS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/cards`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('cards'), scope);
}

export function loadUsers(appId, scope = {}) {
  const params = {
    q: { 'page[limit]': 10000 },
    ...scope,
  };

  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/members{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('users'), params);
}

export function createCard(programId, userId, scope = {}) {
  const config = {
    schema: CARDS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/cards`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newCard = {
    type: CARDS,
    attributes: {
      user: { id: userId },
    },
  };

  return create(config, newCard, scope);
}
