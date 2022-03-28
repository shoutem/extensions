// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

// export everything from extension.js
import './navigation';
import enTranslations from './translations/en.json';
import { authenticateLimitedMiddleware, authenticateMiddleware } from './redux';

export * from './extension';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
export { appDidMount } from './app';
export { ext } from './const';
export { reducer, updateProfile } from './redux';

export const middleware = [
  authenticateLimitedMiddleware,
  authenticateMiddleware,
];
