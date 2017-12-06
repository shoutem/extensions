// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names
import './style.scss';
import { shoutemUrls } from './services';

// export everything from extension.js
export * from './extension';

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports

export function pageWillMount(page) {
  shoutemUrls.init(page);
}
