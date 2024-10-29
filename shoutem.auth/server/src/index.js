import GdprSettingsPage from './pages/gdpr-settings-page';
import GeneralSettingsPage from './pages/general-settings-page';
import ProtectedScreensPage from './pages/protected-screens-page';
import UserGroupsPage from './pages/user-groups-page';
import UsersPage from './pages/users-page';
import reducer from './redux';
import { shoutemUrls } from './services';
import './style.scss';

export const pages = {
  GeneralSettingsPage,
  UsersPage,
  UserGroupsPage,
  ProtectedScreensPage,
  GdprSettingsPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer();
  shoutemUrls.init(page);
}

export { pageReducer as reducer };
