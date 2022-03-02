import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, ImageBackground, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../../const';

function ProfileImage({ isEditable, uri, onPress, style }) {
  const resolvedSource = useMemo(() => (uri ? { uri } : { uri: undefined }), [
    uri,
  ]);

  return (
    <View styleName="h-center lg-gutter-vertical vertical">
      <TouchableOpacity disabled={!onPress} onPress={onPress}>
        <ImageBackground
          style={style.image}
          source={resolvedSource}
          borderRadius={style.image?.borderRadius}
        >
          {isEditable && <Icon name="take-a-photo" style={style.placeholder} />}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

ProfileImage.propTypes = {
  isEditable: PropTypes.bool,
  style: PropTypes.object,
  uri: PropTypes.string,
  onPress: PropTypes.func,
};

ProfileImage.defaultProps = {
  isEditable: false,
  style: {},
  uri: undefined,
  onPress: undefined,
};

export default connectStyle(ext('ProfileImage'))(ProfileImage);
