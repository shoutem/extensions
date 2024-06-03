import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, View } from '@shoutem/ui';
import { ext } from '../const';

const ProfileImage = ({ image, style }) => (
  <View styleName="flexible vertical h-center v-center" style={style.container}>
    <Image source={image} style={style.image} />
  </View>
);

ProfileImage.propTypes = {
  style: PropTypes.object.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ uri: PropTypes.string }),
  ]),
};

ProfileImage.defaultProps = {
  image: null,
};

export default connectStyle(ext('ProfileImage'))(ProfileImage);
