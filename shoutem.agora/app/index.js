// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

// export everything from extension.js
// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports

import './navigation';
import enTranslations from './translations/en.json';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export * from './extension';
