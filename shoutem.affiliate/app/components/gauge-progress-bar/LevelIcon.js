import React from 'react';
import VectorIcon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../../const';

export function LevelIcon(props) {
  const { containerStyle, levelReached, style } = props;

  const resolvedStyle = [
    style.level,
    levelReached && style.levelReached,
    containerStyle,
  ];

  const resolvedIconStyle = [
    style.icon,
    levelReached && style.iconLevelReached,
  ];

  return (
    <View style={resolvedStyle}>
      <VectorIcon name="check" style={resolvedIconStyle} />
    </View>
  );
}

LevelIcon.propTypes = {
  containerStyle: PropTypes.object.isRequired,
  levelReached: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('LevelIcon'))(LevelIcon);
