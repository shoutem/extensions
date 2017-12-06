export {
  UserGroupsDropdown,
  UserGroupsDashboard,
  UserGroupScreenSettings,
} from './components';

export {
  moduleName,
  USER_GROUPS,
} from './const';

export {
  loadUserGroups,
  getUserGroups,
  deleteUserGroup,
  createUserGroup,
  updateUserGroup,
} from './redux';

import { reducer } from './redux';
export default reducer;
