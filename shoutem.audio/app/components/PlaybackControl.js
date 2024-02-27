import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, TouchableOpacity } from '@shoutem/ui';
import { ext } from '../const';

export const PlaybackControl = ({ onPress, iconName, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style.container}>
      <Icon name={iconName} style={style.icon} />
    </TouchableOpacity>
  );
};

PlaybackControl.propTypes = {
  iconName: PropTypes.string,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

PlaybackControl.defaultProps = {
  iconName: 'play',
  style: {},
  onPress: undefined,
};

export default connectStyle(ext('PlaybackControl'))(PlaybackControl);
