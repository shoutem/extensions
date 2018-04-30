import PropTypes from 'prop-types';
import React from 'react';

import {
  Icon,
  ImageBackground,
  TouchableOpacity,
  View,
  dimensionRelativeToIphone,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

const ProfileImage = ({ isEditable, onPress, uri }) => (
  <View styleName="h-center lg-gutter-vertical solid vertical">
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        styleName="medium-avatar placeholder"
        source={{ uri: uri || undefined }}
        borderRadius={dimensionRelativeToIphone(145) / 2}
      >
        {isEditable &&
          <Icon
            name="take-a-photo"
            style={uri ? { color: '#ffffff' } : {}}
          />
        }
      </ImageBackground>
    </TouchableOpacity>
  </View>
);

const { bool, func, string } = PropTypes;

ProfileImage.propTypes = {
  // Determines whether the image should render an indicator that it can be edited
  isEditable: bool,
  // Called when the image is pressed
  onPress: func,
  // Image URI
  uri: string,
};

export default connectStyle(ext('ProfileImage'))(ProfileImage);
