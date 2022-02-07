// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names
import { shoutemUrls } from './services';

// export everything from extension.js
export * from './extension';

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
export { reducer } from './redux';

export function pageWillMount(page) {
  const {
    pageContext: {
      url: { auth },
    },
  } = page;

  shoutemUrls.init({
    authEndpoint: auth,
  });
}
