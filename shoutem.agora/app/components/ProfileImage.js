import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { images } from '../assets/index';
import { ext } from '../const';

function ProfileImage({ image, style }) {
  const source = image ? { uri: image } : images.emptyUserProfile;
  return (
    <View style={style.profileImage}>
      <ImageBackground source={source} />
    </View>
  );
}

ProfileImage.propTypes = {
  image: PropTypes.string,
  style: PropTypes.object,
};

export default connectStyle(ext('ProfileImage'))(ProfileImage);
