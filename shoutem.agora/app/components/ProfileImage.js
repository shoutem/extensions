import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

function ProfileImage({ image, style }) {
  return (
    <View style={style.profileImage}>
      <ImageBackground source={image} />
    </View>
  );
}

ProfileImage.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ uri: PropTypes.string }),
  ]),
  style: PropTypes.object,
};

export default connectStyle(ext('ProfileImage'))(ProfileImage);
