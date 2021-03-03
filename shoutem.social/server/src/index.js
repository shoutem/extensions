// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import SocialSettingsPage from './pages/social-settings-page';
import ShortcutInfoPage from './pages/shortcut-info-page';
import UserGroupsVisibilityPage from './pages/user-groups-visibility-page';
import reducer from './redux';
import { shoutemUrls } from './services';

export const pages = {
  SocialSettingsPage,
  ShortcutInfoPage,
  UserGroupsVisibilityPage,
};

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer(page);
  shoutemUrls.init(page);
}

export { pageReducer as reducer };
