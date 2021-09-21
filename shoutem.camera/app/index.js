import { QRCodeScanner } from './components';
import { QRCodeScannerScreen } from './screens';
import enTranslations from './translations/en.json';
import './navigation';

export const screens = {
  QRCodeScannerScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { navigateToQRCodeScannerScreen, scanQRCode } from './redux';

export { QRCodeScanner };
