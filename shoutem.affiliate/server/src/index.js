// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names
import { getExtension } from '@shoutem/redux-api-sdk';
import { ext } from './const';
import { shoutemUrls } from './services';

// export everything from extension.js
export * from './extension';

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
export { reducer } from './redux';

export function pageWillMount(_page, store) {
  const state = store.getState();
  const {
    settings: {
      services: {
        core: { auth, cms, loyalty },
      },
    },
  } = getExtension(state, ext());

  shoutemUrls.init({
    authEndpoint: auth,
    cmsEndpoint: cms,
    loyaltyEndpoint: loyalty,
  });
}
