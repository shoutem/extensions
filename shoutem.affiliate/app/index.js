// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names
import enTranslations from './translations/en.json';

export { reducer } from './redux';
// export everything from extension.js
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
