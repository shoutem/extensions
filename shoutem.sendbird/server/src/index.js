import { shoutemUrls } from './services';

export * from './extension';
export { reducer } from './state';
// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports

export function pageWillMount(page) {
  shoutemUrls.init(page);
}
