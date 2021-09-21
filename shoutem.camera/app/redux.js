import { goBack, openInModal } from 'shoutem.navigation';

import { ext } from './const';

/**
 * Opens a screen to scan a QR code in a modal.
 * Triggers a callback function when a code has been scanned.
 */
export const scanQRCode = (onQRCodeScanned, title) => {
  const callback = code => {
    if (code.data) {
      goBack();
      onQRCodeScanned(code.data);
    }
  };

  openInModal(ext('QRCodeScannerScreen'), { onQRCodeScanned: callback, title });
};

/**
 * Navigates to QR Code scanner screen
 */
export const navigateToQRCodeScannerScreen = (onQRCodeScanned, title) => {
  openInModal(ext('QRCodeScannerScreen'), { onQRCodeScanned, title });
};
