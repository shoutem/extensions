/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ATTACHMENT_TYPE, ext } from '../const';

const windowWidth = Dimensions.get('window').width;

const GiphyImage = ({ item, onPress, style }) => {
  const [loading, setLoading] = useState(true);

  if (!item.images) {
    return null;
  }

  const { width, height } = item.images.fixed_height;

  const imageWidth = windowWidth / 3 - 5;
  const imageHeight = (imageWidth * height) / width;

  const handleLoadStart = () => setLoading(true);
  const handleLoad = () => setLoading(false);

  const handleGifPress = () => {
    const { url, size } = item.images.downsized;

    onPress({ path: url, size, type: ATTACHMENT_TYPE.GIF });
  };

  return (
    <Pressable onPress={handleGifPress}>
      {loading && (
        <ActivityIndicator style={style.loadingIndicator} size="small" />
      )}
      <FastImage
        source={{ uri: item.images.fixed_width_small.url, priority: 'high' }}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        resizeMode="contain"
        style={[
          {
            width: imageWidth,
            height: imageHeight,
          },
          style.image,
        ]}
      />
    </Pressable>
  );
};

GiphyImage.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

GiphyImage.defaultProps = {
  style: {},
};

export default connectStyle(ext('GiphyImage'))(GiphyImage);
