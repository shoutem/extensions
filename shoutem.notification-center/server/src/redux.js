import { createScopedReducer } from '@shoutem/redux-api-sdk';
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash';
import appReducer, { moduleName as app } from './modules/app';
import notificationReducer, {
  moduleName as notification,
} from './modules/notifications';
import groupReducer, { moduleName as group } from './modules/groups';
import ext from './const';

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
      form: formReducer,
      [app]: appReducer,
      [notification]: notificationReducer,
      [group]: groupReducer,
    },
  });
