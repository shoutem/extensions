import enTranslations from './translations/en.json';

export { PERMISSION_RESULT_TYPES, PERMISSION_TYPES } from './const';
export { reducer, withAlarmPermission } from './redux';
export {
  check,
  checkNotifications,
  checkPermissions,
  openDeviceSettings,
  openSettings,
  request,
  requestNotifications,
  requestPermissions,
  RESULTS,
} from './services';

export const shoutem = {
  i18n: {
    translations: { en: enTranslations },
  },
};

export { appDidMount } from './app';
