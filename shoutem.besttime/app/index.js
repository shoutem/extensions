// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

// export everything from extension.js
export * from './extension';

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
import { Platform, UIManager } from 'react-native';
import enTranslations from './translations/en.json';

export { reducer } from './redux';

export { appDidMount } from './app';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
