import { isIos, isWeb } from 'shoutem-core';

export const getMapUrl = (lat, long, address) => {
  if (isIos) {
    return `http://maps.apple.com/?ll=${lat},${long}&q=${address}`;
  }

  if (isWeb) {
    return `https://maps.google.com/?q=${lat},${long}&z=8`;
  }

  return `geo:${lat},${long}?q=${address}`;
};
