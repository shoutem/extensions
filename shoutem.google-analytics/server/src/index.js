// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports

// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names
import { SettingsPage } from './pages';
import { reducer } from './redux';

export const pages = {
  SettingsPage,
};

// eslint-disable-next-line import/no-mutable-exports
let pageReducer = null;

export function pageWillMount() {
  pageReducer = reducer();
}

export { pageReducer as reducer };
