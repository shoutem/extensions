import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, ImageBackground, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../const';

const ProfileImage = ({ isEditable, onPress, uri, style }) => (
  <View styleName="h-center lg-gutter-vertical solid vertical">
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        styleName="placeholder"
        imageStyle={style.image}
        style={style.imageContainer}
        source={{ uri: uri || undefined }}
      >
        {isEditable && (
          <Icon name="take-a-photo" style={uri ? style.noImageIcon : {}} />
        )}
      </ImageBackground>
    </TouchableOpacity>
  </View>
);

const { bool, func, string, object } = PropTypes;

ProfileImage.propTypes = {
  // Determines whether the image should render an indicator that it can be edited
  isEditable: bool,
  style: object,
  // Image URI
  uri: string,
  // Called when the image is pressed
  onPress: func,
};

ProfileImage.defaultProps = {
  // Determines whether the image should render an indicator that it can be edited
  isEditable: false,
  // Called when the image is pressed
  onPress: func,
  // Image URI
  uri: string,
  style: PropTypes.object,
};

export default connectStyle(ext('ProfileImage'))(ProfileImage);
