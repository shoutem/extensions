import { getExtensionSettings } from 'shoutem.application';
import { ext } from './const';
import { bestTime, googlePlaces } from './services';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const i18nSettings = getExtensionSettings(state, 'shoutem.i18n');
  const { locale = 'en' } = i18nSettings;

  const settings = getExtensionSettings(state, ext());
  const { bestTimePrivateKey, googlePlacesKey } = settings;

  bestTime.init(bestTimePrivateKey);
  googlePlaces.init(googlePlacesKey, locale);
}
