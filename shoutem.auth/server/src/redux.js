import _ from 'lodash';
import { reducer as formReducer } from 'redux-form';
import { createScopedReducer } from '@shoutem/redux-api-sdk';
import userGroupsReducer, { moduleName as userGroups } from './modules/user-groups';
import usersReducer, { moduleName as users } from './modules/users';
import generalSettingsReducer, { moduleName as generalSettings } from './modules/general-settings';
import ext from './const';

// SELECTORS
function getExtensionState(state) {
  return _.get(state, ext(), {});
}

export function getFormState(state) {
  const extensionState = getExtensionState(state);
  return extensionState.form;
}

export default () => (
  createScopedReducer({
    extension: {
      form: formReducer,
      [userGroups]: userGroupsReducer,
      [users]: usersReducer,
      [generalSettings]: generalSettingsReducer,
    },
  })
);
