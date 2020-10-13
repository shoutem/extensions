import { reducer } from './redux';

export {
  GeneralSettings,
  FacebookSetupForm,
  AppleSetupForm,
} from './components';

export { moduleName } from './const';

export {
  getAppSettings,
  getAppStoreSettings,
  loadAppSettings,
  loadAppStoreSettings,
  updateAppSettings,
  updateAppRealm,
} from './redux';

export default reducer;
