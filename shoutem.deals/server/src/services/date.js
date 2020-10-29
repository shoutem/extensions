import i18next from 'i18next';
import LOCALIZATION from './localization';

export function getDisplayDateFormat() {
  return i18next.t(LOCALIZATION.DISPLAY_DATE_FORMAT);
}

export function getDisplayTimeFormat() {
  return i18next.t(LOCALIZATION.DISPLAY_TIME_FORMAT);
}
