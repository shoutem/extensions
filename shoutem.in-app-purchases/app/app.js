import Iaphub from 'react-native-iaphub';
import DeviceInfo from 'react-native-device-info';
import { getExtensionSettings } from 'shoutem.application/redux';
import { isPreviewApp } from 'shoutem.preview';
import { AppInitQueue, setQueueTargetComplete } from 'shoutem.application';
import { actions, selectors } from './redux';
import { ext } from './const';

AppInitQueue.addExtension(ext());

export const appDidMount = app => {
  const store = app.getStore();
  const state = store.getState();
  const extensionSettings = getExtensionSettings(state, ext());
  const {
    iapHubAppId,
    iapHubApiKey,
    iapHubEnvironment,
    subscriptionRequired,
  } = extensionSettings;

  const subscriptionConfigured = selectors.hasProperConfiguration(state);

  if (!subscriptionConfigured || !subscriptionRequired || isPreviewApp) {
    store.dispatch(setQueueTargetComplete(ext()));
    return null;
  }

  return Iaphub.init({
    appId: iapHubAppId,
    apiKey: iapHubApiKey,
    environment: iapHubEnvironment,
  })
    .then(() => Iaphub.setUserId(DeviceInfo.getUniqueId()))
    .then(() => store.dispatch(actions.loadProducts()))
    .then(() => store.dispatch(setQueueTargetComplete(ext())));
};
