import _ from 'lodash';
import { createScopedReducer } from '@shoutem/api';
import { reducer as formReducer } from 'redux-form';
import { create } from '@shoutem/redux-io';
import rulesReducer, { moduleName as rules, createRule } from './modules/rules';
import cashiersReducer, { moduleName as cashiers } from './modules/cashiers';
import { loyaltyApi } from './services';
import ext from './const';

// CONST
export const PROGRAMS = 'shoutem.loyalty.programs';
export const AUTHORIZATIONS = 'shoutem.loyalty.authorizations';

// SELECTORS
export function getFormState(state) {
  return _.get(state, [ext(), 'form']);
}

// ACTIONS
function createProgram() {
  const config = {
    schema: PROGRAMS,
    request: {
      endpoint: loyaltyApi('/v1/programs'),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newProgram = {
    type: PROGRAMS,
    attributes: {
      name: 'Program',
    },
  };

  return create(config, newProgram);
}

function createAuthorization(programId, authorizationType = 'pin') {
  const config = {
    schema: AUTHORIZATIONS,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/authorizations`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const authorization = {
    type: AUTHORIZATIONS,
    attributes: {
      authorizationType,
      implementationData: {},
    },
  };

  return create(config, authorization);
}

export function enableLoyalty(rules, authorizationTypes = ['pin', 'userId']) {
  return dispatch => (
    dispatch(createProgram())
      .then(action => {
        const programId = _.get(action, ['payload', 'data', 'id']);

        const ruleActions = _.map(rules, rule => (
          dispatch(createRule(rule, programId))
        ));

        const authActions = _.map(authorizationTypes, authType => (
          dispatch(createAuthorization(programId, authType))
        ));

        return Promise.all([
          ...authActions,
          ...ruleActions,
        ]).then(() => programId);
      })
  );
}

export default () => (
  createScopedReducer({
    extension: {
      form: formReducer,
      [rules]: rulesReducer,
      [cashiers]: cashiersReducer,
    },
  })
);
