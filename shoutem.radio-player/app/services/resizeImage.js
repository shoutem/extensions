import { Dimensions, PixelRatio } from 'react-native';
import { NAVIGATION_HEADER_HEIGHT } from '@shoutem/ui';

export function getResizedImageSource(backgroundImageUrl) {
  if (!backgroundImageUrl) {
    return null;
  }

  const { width, height } = Dimensions.get('window');
  const imageWidth = PixelRatio.getPixelSizeForLayoutSize(width);
  const imageHeight = PixelRatio.getPixelSizeForLayoutSize(
    height - NAVIGATION_HEADER_HEIGHT,
  );

  return {
    uri: getWeServUrl(backgroundImageUrl, imageWidth, imageHeight),
  };
}

export function getWeServUrl(url, width, height, fit = 'inside') {
  // weserv service expects the URL without a protocol, so we strip the protocol here;
  // the ssl: prefix can be used to force the secure connection when fetching images
  const cleanUrl = url.replace('https://', 'ssl:').replace(/^.*:\/\//g, '');
  const encodedUrl = encodeURIComponent(cleanUrl);

  const h = height || width;

  return `https://images.weserv.nl/?url=${encodedUrl}&w=${width}&h=${h}&fit=${fit}`;
}
