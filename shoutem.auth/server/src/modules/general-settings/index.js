import { reducer } from './redux';

export {
  GeneralSettings,
  FacebookSetupForm,
  AppleSetupForm,
} from './components';

export {
  moduleName,
} from './const';

export {
  getAppSettings,
  getAppStoreSettings,
  loadAppSettings,
  loadAppStoreSettings,
  updateAppSettings,
  updateAppleClientId,
} from './redux';

export default reducer;
