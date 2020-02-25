import QRCodeScanner from './components/QRCodeScanner.js';
import QRCodeScannerScreen from './screens/QRCodeScannerScreen.js';
import enTranslations from './translations/en.json';

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

export {
  navigateToQRCodeScannerScreen,
  scanQRCode,
} from './redux';

export { QRCodeScanner };
