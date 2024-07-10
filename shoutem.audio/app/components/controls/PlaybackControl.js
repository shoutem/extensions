import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../../const';

export const PlaybackControl = ({
  onPress,
  disabled,
  iconName,
  isLoadingOrBuffering,
  style,
}) => {
  return (
    <>
      {isLoadingOrBuffering && (
        <View style={style.spinnerContainer}>
          <ActivityIndicator style={style.spinner} />
        </View>
      )}
      {!isLoadingOrBuffering && (
        <TouchableOpacity
          disabled={disabled}
          onPress={onPress}
          style={[style.container, disabled && style.disabled]}
        >
          <Icon name={iconName} style={style.icon} />
        </TouchableOpacity>
      )}
    </>
  );
};

PlaybackControl.propTypes = {
  disabled: PropTypes.bool,
  iconName: PropTypes.string,
  isLoadingOrBuffering: PropTypes.bool,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

PlaybackControl.defaultProps = {
  disabled: false,
  iconName: 'play',
  isLoadingOrBuffering: false,
  style: {},
  onPress: undefined,
};

export default connectStyle(ext('PlaybackControl'))(PlaybackControl);
