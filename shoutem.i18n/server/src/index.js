// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names
import { reducer } from './redux';
import { shoutemUrls } from './services';
import './style.scss';

// export everything from extension.js
export * from './extension';

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports

let pageReducer = null;

export function pageWillMount(page) {
  pageReducer = reducer();
  shoutemUrls.init(page);
}

export { pageReducer as reducer };
