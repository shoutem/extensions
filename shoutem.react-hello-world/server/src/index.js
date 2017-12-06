// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import HelloShortcutPage from './pages/hello-shortcut-page';
import HelloExtensionPage from './pages/hello-extension-page';
import reducer from './redux';
import './style.scss';

export const pages = {
  HelloShortcutPage,
  HelloExtensionPage,
};

//export { reducer };

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer(page);
}

export { pageReducer as reducer };
