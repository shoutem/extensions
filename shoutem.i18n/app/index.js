import { changeLocaleMiddleware } from './redux';
import { SelectLanguageScreen } from './screens';

export const screens = { SelectLanguageScreen };

export * from './app';
export { LocalizationContext, LocalizationProvider } from './providers';
export { createLocaleChangedMiddleware, reducer, selectors } from './redux';
export { default as I18n } from 'i18n-js';

export const middleware = [changeLocaleMiddleware];
