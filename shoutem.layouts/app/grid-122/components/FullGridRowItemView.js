import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ImageBackground,
  Text,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { ext } from '../../const';

export function FullGridRowItemView({
  imageSource,
  numberOfLines,
  id,
  subtitle,
  title,
  onPress,
  renderActions,
  style,
}) {
  function handlePress() {
    if (onPress) {
      onPress(id);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={!onPress && 1}
      onPress={handlePress}
      style={style.container}
    >
      <ImageBackground source={imageSource} style={style.imageContainer}>
        <View styleName="actions" virtual>
          {!!renderActions && renderActions(id)}
        </View>
      </ImageBackground>
      <View style={style.textContainer}>
        <Title numberOfLines={1} style={style.title}>
          {title}
        </Title>
        <Text numberOfLines={numberOfLines} style={style.subtitle}>
          {subtitle}
        </Text>
      </View>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

FullGridRowItemView.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageSource: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  numberOfLines: PropTypes.number,
  renderActions: PropTypes.func,
  style: PropTypes.object,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
};

FullGridRowItemView.defaultProps = {
  imageSource: null,
  numberOfLines: 2,
  subtitle: '',
  style: {},
  renderActions: undefined,
  onPress: undefined,
};

export default connectStyle(ext('FullGridRowItemView'))(FullGridRowItemView);
