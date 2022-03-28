import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, View } from '@shoutem/ui';
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
      <Icon name="checkbox-on" style={resolvedIconStyle} />
    </View>
  );
}

LevelIcon.propTypes = {
  containerStyle: PropTypes.object.isRequired,
  levelReached: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('LevelIcon'))(LevelIcon);
