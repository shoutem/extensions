import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../const';

export const PlaybackControl = ({
  onPress,
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
        <TouchableOpacity onPress={onPress} style={style.container}>
          <Icon name={iconName} style={style.icon} />
        </TouchableOpacity>
      )}
    </>
  );
};

PlaybackControl.propTypes = {
  iconName: PropTypes.string,
  isLoadingOrBuffering: PropTypes.bool,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

PlaybackControl.defaultProps = {
  iconName: 'play',
  isLoadingOrBuffering: false,
  style: {},
  onPress: undefined,
};

export default connectStyle(ext('PlaybackControl'))(PlaybackControl);
