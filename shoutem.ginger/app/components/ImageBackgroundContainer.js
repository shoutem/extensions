import React, { useLayoutEffect } from 'react';
import { ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { HeaderStyles } from 'shoutem.navigation';
import { ext } from '../const';

function ImageBackgroundContainer({ src, children, style }) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (src) {
      navigation.setOptions({
        ...HeaderStyles.clear,
      });
    }
  }, [navigation, src]);

  if (!src) {
    return children;
  }

  return (
    <ImageBackground source={src} resizeMode="cover" style={style.container}>
      {children}
    </ImageBackground>
  );
}

ImageBackgroundContainer.propTypes = {
  children: PropTypes.node.isRequired,
  src: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  style: PropTypes.object,
};

ImageBackgroundContainer.defaultProps = {
  src: null,
  style: {},
};

export default connectStyle(ext('ImageBackgroundContainer'))(
  ImageBackgroundContainer,
);
