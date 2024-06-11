export const SET_LOCALE = 'shoutem.i18n.SET_LOCALE';
export const LOCALE_CHANGED = 'shoutem.i18n.LOCALE_CHANGED';

export function setLocale(localeTag) {
  return { type: SET_LOCALE, payload: localeTag };
}

export const localeChanged = () => ({ type: LOCALE_CHANGED });

export default { setLocale, localeChanged };
