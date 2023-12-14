import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Lightbox, responsiveHeight } from '@shoutem/ui';
import { ext } from '../../const';

const MAX_IMAGE_HEIGHT = responsiveHeight(350);

function ImageAttachment({ enableImagePreview, source, style }) {
  const [height, setHeight] = useState(0);

  const fastImageSource = useMemo(
    () => ({ uri: source.uri, priority: 'high' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleImageLoaded = useCallback(e => {
    const aspectRatio = e.nativeEvent.height / e.nativeEvent.width;

    const newHeight = MAX_IMAGE_HEIGHT * aspectRatio;

    setHeight(newHeight > MAX_IMAGE_HEIGHT ? MAX_IMAGE_HEIGHT : newHeight);
  }, []);

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
          onLoad={handleImageLoaded}
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
