import { changeLocaleMiddleware } from './redux';
import { SelectLanguageScreen } from './screens';

export const screens = { SelectLanguageScreen };

export { reducer, selectors } from './redux';

export * from './app';

export { default as I18n } from 'i18n-js';

export const middleware = [changeLocaleMiddleware];
