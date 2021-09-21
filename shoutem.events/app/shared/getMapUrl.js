import { Platform } from 'react-native';

export function getMapUrl(lat, long, address) {
  return Platform.OS === 'ios'
    ? `http://maps.apple.com/?ll=${lat},${long}&q=${address}`
    : `geo:${lat},${long}?q=${address}`;
}
