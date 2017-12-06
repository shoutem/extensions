import { createScopedReducer } from '@shoutem/redux-api-sdk';
import { reducer as formReducer } from 'redux-form';
import ext from 'src/const';
import programReducer, {
  moduleName as program,
} from 'src/modules/program';
import rulesReducer, {
  moduleName as rules,
} from 'src/modules/rules';
import cashiersReducer, {
  moduleName as cashiers,
} from 'src/modules/cashiers';
import cmsReducer, {
  moduleName as cms,
} from 'src/modules/cms';
import punchRewardsReducer, {
  moduleName as punchRewards,
} from 'src/modules/punch-rewards';
import transactionsReducer, {
  moduleName as transactions,
} from 'src/modules/transactions';
import {
  moduleName as placeRewards,
  extensionReducer as placeRewardsExtensionReducer,
  shortcutReducer as placeRewardsShortcutReducer,
} from 'src/modules/place-rewards';

// SELECTORS
export function getFormState(state) {
  return _.get(state, [ext(), 'form']);
}

// ACTIONS
export function navigateToSettings(appId, sectionId) {
  const options = { appId, sectionId };

  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: {
      component: 'settings',
      options,
    },
  };
}

export function navigateToUrl(url) {
  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: {
      component: 'external',
      options: { url },
    },
  };
}

// REDUCER
export const reducer = () => (
  createScopedReducer({
    extension: {
      form: formReducer,
      [program]: programReducer,
      [rules]: rulesReducer,
      [cashiers]: cashiersReducer,
      [cms]: cmsReducer,
      [transactions]: transactionsReducer,
      [punchRewards]: punchRewardsReducer,
      [placeRewards]: placeRewardsExtensionReducer,
    },
    shortcut: {
      [placeRewards]: placeRewardsShortcutReducer,
    },
  })
);
