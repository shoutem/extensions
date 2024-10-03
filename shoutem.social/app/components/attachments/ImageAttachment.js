import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Lightbox, responsiveHeight } from '@shoutem/ui';
import { isWeb } from 'shoutem-core';
import { ext } from '../../const';

const MAX_IMAGE_HEIGHT = responsiveHeight(350);

function ImageAttachment({ enableImagePreview, source, style }) {
  const [height, setHeight] = useState(0);

  const fastImageSource = useMemo(
    () => ({ uri: source.uri, priority: 'high' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleImageLoaded = useCallback(async e => {
    const aspectRatio = e.nativeEvent.height / e.nativeEvent.width;

    const newHeight = aspectRatio
      ? MAX_IMAGE_HEIGHT * aspectRatio
      : MAX_IMAGE_HEIGHT;

    setHeight(newHeight > MAX_IMAGE_HEIGHT ? MAX_IMAGE_HEIGHT : newHeight);
  }, []);

  // Web Image doesn't have native width and height in native event, we want to fetch it.
  // Creating separate platform functions because we have to fetch image dimensions in web, but
  // we don't want to do unnecessary fetch on native side, because data is available already.
  const handleImageLoadedWeb = useCallback(() => {
    Image.getSize(source.uri, (width, height) => {
      const aspectRatio = height / width;

      const newHeight = aspectRatio
        ? MAX_IMAGE_HEIGHT * aspectRatio
        : MAX_IMAGE_HEIGHT;

      setHeight(newHeight > MAX_IMAGE_HEIGHT ? MAX_IMAGE_HEIGHT : newHeight);
    });
  }, [source.uri]);

  if (!source?.uri) {
    return null;
  }

  return (
    <Lightbox disabled={!enableImagePreview} underlayColor="transparent">
      <>
        {!height && (
          <ActivityIndicator style={style.loadingIndicator} size="small" />
        )}
        <FastImage
          source={fastImageSource}
          resizeMode="contain"
          style={[style.imagePreview, { height }]}
          onLoad={isWeb ? handleImageLoadedWeb : handleImageLoaded}
        />
      </>
    </Lightbox>
  );
}

ImageAttachment.propTypes = {
  enableImagePreview: PropTypes.bool.isRequired,
  source: PropTypes.object,
  style: PropTypes.object,
};

ImageAttachment.defaultProps = {
  source: null,
  style: {},
};

export default connectStyle(ext('ImageAttachment'))(ImageAttachment);
