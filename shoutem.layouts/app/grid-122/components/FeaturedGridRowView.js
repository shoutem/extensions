import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ImageBackground,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from '../../assets';
import { ext } from '../../const';

export function FeaturedGridRowItemView({
  id,
  imageUrl,
  subtitle,
  title,
  onPress,
  renderActions,
  numberOfLines,
  style,
}) {
  const imageSource = imageUrl ? { uri: imageUrl } : assets.noImagePlaceholder;

  function handlePress() {
    if (onPress) {
      onPress(id);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={!onPress && 1}
      onPress={handlePress}
      styleName="flexible"
      style={style.container}
    >
      <ImageBackground style={style.imageContainer} source={imageSource}>
        <Tile>
          <View styleName="actions" virtual>
            {!!renderActions && renderActions(id)}
          </View>
        </Tile>
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

FeaturedGridRowItemView.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  numberOfLines: PropTypes.number,
  renderActions: PropTypes.func,
  style: PropTypes.object,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
};

FeaturedGridRowItemView.defaultProps = {
  imageUrl: null,
  numberOfLines: 2,
  subtitle: '',
  style: {},
  renderActions: undefined,
  onPress: undefined,
};

export default connectStyle(ext('FeaturedGridRowItemView'))(
  FeaturedGridRowItemView,
);
