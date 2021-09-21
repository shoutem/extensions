import enTranslations from './translations/en.json';

export { PERMISSION_TYPES, PERMISSION_RESULT_TYPES } from './const';

export {
  checkPermissions,
  openDeviceSettings,
  requestPermissions,
  checkNotifications,
  requestNotifications,
  openSettings,
  check,
  request,
  RESULTS,
} from './services';

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};
