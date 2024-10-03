// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

// export everything from extension.js
// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
import { Platform, UIManager } from 'react-native';
import { isAndroid } from 'shoutem-core';
import enTranslations from './translations/en.json';

export { appDidMount } from './app';
export * from './extension';
export { reducer } from './redux';
export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

if (isAndroid) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
