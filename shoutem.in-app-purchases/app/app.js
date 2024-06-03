import DeviceInfo from 'react-native-device-info';
import Iaphub from 'react-native-iaphub';
import { AppInitQueue, setQueueTargetComplete } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import { isPreviewApp } from 'shoutem.preview';
import { ext } from './const';
import { actions, selectors } from './redux';

AppInitQueue.addExtension(ext());

const deriveUserId = async () => {
  try {
    const uniqueId = await DeviceInfo.getUniqueId();
    await Iaphub.login(uniqueId);
  } catch {
    // eslint-disable-next-line no-console
    console.log('IAP User not found. Continuing with anonymous mode');
  }
};

export const appDidMount = app => {
  const store = app.getStore();
  const state = store.getState();
  const extensionSettings = getExtensionSettings(state, ext());
  const {
    iapHubAppId,
    iapHubApiKey,
    iapHubEnvironment,
    subscriptionRequired,
    singularProductPerScreenEnabled,
  } = extensionSettings;

  const subscriptionConfigured = singularProductPerScreenEnabled
    ? true
    : selectors.hasProperGlobalConfiguration(state);

  if (!subscriptionConfigured || !subscriptionRequired || isPreviewApp) {
    store.dispatch(setQueueTargetComplete(ext()));
    return null;
  }

  return Iaphub.start({
    appId: iapHubAppId,
    apiKey: iapHubApiKey,
    allowAnonymousPurchase: true,
    environment: iapHubEnvironment,
  })
    .then(deriveUserId)
    .then(() => store.dispatch(actions.loadProducts()))
    .then(() => store.dispatch(setQueueTargetComplete(ext())))
    .catch(error => {
      // eslint-disable-next-line no-console
      console.warn('Error initializing IAPHub', error);
      store.dispatch(setQueueTargetComplete(ext()));
    });
};
