import _ from 'lodash';
import ext from 'src/const';
import { loadResources } from 'src/modules/cms';
import { createRule } from 'src/modules/rules';
import { getLoyaltyUrl, shoutemUrls } from 'src/services';
import { create, find, update } from '@shoutem/redux-io';
import { AUTHORIZATIONS, CARDS, PLACES, PROGRAMS, USERS } from '../const';

const MAX_PAGE_SIZE = 10000;

function createProgram(context, scope) {
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

  const appOwnerId = _.get(context, 'appOwnerId');
  _.set(newProgram, ['attributes', 'owner', 'id'], appOwnerId);

  return create(config, newProgram, scope);
}

export function createAuthorization(programId, authorizationData, scope = {}) {
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
      endpoint: getLoyaltyUrl(
        `/v1/programs/${programId}/authorizations/${authorizationId}`,
      ),
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
  context,
  scope = {},
) {
  return dispatch =>
    dispatch(createProgram(context, scope)).then(action => {
      const programId = _.get(action, ['payload', 'data', 'id']);

      const ruleActions = _.map(ruleTemplates, rule =>
        dispatch(createRule(rule, programId, null, scope)),
      );

      const authActions = _.map(authorizationTypes, authorizationType => {
        const authorization = {
          authorizationType,
          implementationData: {},
        };
        return dispatch(createAuthorization(programId, authorization, scope));
      });

      return Promise.all([...authActions, ...ruleActions]).then(
        () => programId,
      );
    });
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
    q: { 'page[limit]': MAX_PAGE_SIZE },
    ...scope,
  };

  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/users{?q*}`,
      ),
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
