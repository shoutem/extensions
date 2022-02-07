import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Icon,
  Image,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

function LevelItem(props) {
  const { level, onPress, points, style } = props;

  const pointsRequired = I18n.t(ext('numberOfPoints'), {
    numberOfPoints: level.numberOfPoints,
  });
  const uri = level.image?.url || '';

  function handleItemPress() {
    onPress(level);
  }

  const iconStyle = [
    style.icon,
    points >= level.numberOfPoints && style.pointsReached,
  ];

  return (
    <TouchableOpacity onPress={handleItemPress}>
      <View styleName="md-gutter horizontal">
        <Image styleName="small rounded-corners placeholder" source={{ uri }} />
        <View styleName="flexible vertical stretch space-between md-gutter-left">
          <Subtitle>{level.title}</Subtitle>
          <Caption>{pointsRequired}</Caption>
        </View>
        <View>
          <View styleName="flexible md-gutter">
            <Icon name="checkbox-on" style={iconStyle} />
          </View>
        </View>
      </View>
      <Divider styleName="section-header" style={style.divider} />
    </TouchableOpacity>
  );
}

LevelItem.propTypes = {
  level: PropTypes.object.isRequired,
  points: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

LevelItem.defaultProps = {
  style: {},
};

export default connectStyle(ext('LevelItem'))(LevelItem);
