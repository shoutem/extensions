// export everything from extension.js
import './navigation';
import enTranslations from './translations/en.json';

export * from './extension';

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
export { appDidMount } from './app';
export { middleware, reducer } from './redux';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};
