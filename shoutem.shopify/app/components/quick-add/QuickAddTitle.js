import React from 'react';
import { Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text } from '@shoutem/ui';
import { ext } from '../../const';

function QuickAddTitle({ onPress, title, style }) {
  return (
    <Pressable onPress={onPress} style={style.container}>
      <Icon name="down-arrow" style={style.icon} />
      <Text style={style.title}>{title}</Text>
    </Pressable>
  );
}

QuickAddTitle.propTypes = {
  style: PropTypes.object.isRequired,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

QuickAddTitle.defaultProps = {
  onPress: undefined,
  title: '',
};

export default connectStyle(ext('QuickAddTitle'))(QuickAddTitle);
