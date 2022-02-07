import { getExtensionSettings } from 'shoutem.application';
import { ext } from './const';
import { shoutemApi } from './services';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const {
    services: {
      core: { loyalty: loyaltyEndpoint },
    },
  } = getExtensionSettings(state, ext());

  shoutemApi.init(loyaltyEndpoint);
}
