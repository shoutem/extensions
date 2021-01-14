
import enTranslations from './translations/en.json';

export { PERMISSION_TYPES, PERMISSION_RESULT_TYPES } from './const';

export {
  checkPermissions,
  openDeviceSettings,
  requestPermissions,
} from './permissions';

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};
