import { Dimensions, PixelRatio } from 'react-native';

const window = Dimensions.get('window');

/**
 * Modifies the source prop of remote images so that images are
 * resized to the dimensions of the Image component that renders
 * them. The resizing is currently done through a remote web service
 * https://images.weserv.nl/.
 *
 * @param imageProps The props of the Image component.
 * @returns {*} The transformed props.
 */
export const resizeImageSource = imageProps => {
  const { style, source } = imageProps;

  if (!source || !source.uri || source.uri.startsWith('data:')) {
    // We can only resize remote images
    return imageProps;
  }

  const imageWidth = PixelRatio.getPixelSizeForLayoutSize(
    style.width || window.width,
  );
  const imageHeight = PixelRatio.getPixelSizeForLayoutSize(
    style.height || window.height,
  );

  // weserv service expects the URL without a protocol, so we strip the protocol here,
  // the ssl: prefix can be used to force the secure connection when fetching images
  const imageUrl = imageProps.source.uri
    .replace('https://', 'ssl:')
    .replace(/^.*:\/\//g, '');
  const props = {
    ...imageProps,
    source: {
      ...imageProps.source,
      uri: `https://wsrv.nl/?url=${encodeURIComponent(
        imageUrl,
      )}&w=${imageWidth}&t=fit&h=${imageHeight}`,
    },
  };

  return props;
};
