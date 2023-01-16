import _ from 'lodash';
import fontReducer, { moduleName as font } from 'src/modules/fonts';
import { createScopedReducer } from '@shoutem/redux-api-sdk';
import { ext } from './const';

function getExtensionState(state) {
  return _.get(state, ext(), {});
}

export function getFormState(state) {
  const extensionState = getExtensionState(state);
  return extensionState.form;
}

// REDUCER
export const reducer = () =>
  createScopedReducer({
    extension: {
      [font]: fontReducer,
    },
  });
