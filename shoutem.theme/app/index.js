import { AppInitQueue } from 'shoutem.application/services';
import { resolveIconSource } from './helpers/resolveIconSource';
import { customIconUrlRegex, resolveIconUrl } from './helpers/resolveIconUrl';
import enTranslations from './translations/en.json';
import { appDidMount, appWillMount, renderProvider } from './app';
import { ext } from './const';
import { getAppStyle, reducer, selectTheme } from './redux';
import { ThemePickerScreen } from './screens';

AppInitQueue.addExtension(ext());

export {
  appDidMount,
  appWillMount,
  customIconUrlRegex,
  getAppStyle,
  reducer,
  renderProvider,
  resolveIconSource,
  resolveIconUrl,
  selectTheme,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const screens = { ThemePickerScreen };
