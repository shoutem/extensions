import _ from 'lodash';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as cmsReducer } from '@shoutem/cms-dashboard';
import { createScopedReducer } from '@shoutem/redux-api-sdk';
import { storage } from '@shoutem/redux-io';
import dealsReducer, {
  moduleName as deals,
  createDealCategory,
} from './modules/deals';
import statsReducer, {
  moduleName as stats,
  createCatalog,
} from './modules/stats';
import { ext } from './const';
import { types } from './services';

function getExtensionState(state) {
  return _.get(state, ext(), {});
}

export function getFormState(state) {
  const extensionState = getExtensionState(state);

  return extensionState.form;
}

export function initializeSpecialDeals(appId, categoryName, scope = {}) {
  return dispatch =>
    // create CMS category
    dispatch(createDealCategory(appId, categoryName, null, scope)).then(
      categoryResponse => {
        // create catalog for category
        const categoryId = _.toString(categoryResponse.payload.id);

        // both category and catalog are needed
        return Promise.all([
          categoryResponse,
          dispatch(createCatalog(appId, categoryId, scope)),
        ]);
      },
    );
}

export default () =>
  createScopedReducer({
    extension: {
      cms: cmsReducer,
      form: formReducer,
      [stats]: statsReducer(),
      storage: combineReducers({
        deals: storage(types.DEALS),
        places: storage(types.PLACES),
        transactions: storage(types.TRANSACTIONS),
        users: storage(types.USERS),
      }),
    },
    shortcut: {
      [deals]: dealsReducer(),
    },
  });
