import { createScopedReducer } from '@shoutem/redux-api-sdk';
import userGroupsReducer, {
  moduleName as userGroups,
} from './modules/user-groups';

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

export default () =>
  createScopedReducer({
    extension: {
      [userGroups]: userGroupsReducer,
    },
  });
