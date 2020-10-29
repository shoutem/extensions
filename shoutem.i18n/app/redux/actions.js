export const SET_LOCALE = 'shoutem.i18n.SET_LOCALE';

export function setLocale(localeTag) {
  return { type: SET_LOCALE, payload: localeTag };
}

export default { setLocale };
