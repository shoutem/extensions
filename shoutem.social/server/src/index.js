// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import SocialSettingsPage from './pages/social-settings-page';
import ShortcutInfoPage from './pages/shortcut-info-page';
import reducer from './redux';

export const pages = {
  SocialSettingsPage,
  ShortcutInfoPage,
};

// export { reducer };

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer(page);
}

export { pageReducer as reducer };
