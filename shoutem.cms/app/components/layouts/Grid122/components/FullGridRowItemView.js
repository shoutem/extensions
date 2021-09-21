import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ImageBackground,
  Tile,
  Title,
  TouchableOpacity,
  View,
  Text,
} from '@shoutem/ui';
import { ext } from '../../../../const';

export function FullGridRowItemView({
  description,
  imageUrl,
  item,
  numberOfLines,
  onPress,
  renderFavorite,
  style,
  title,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      styleName="flexible"
      style={style.container}
    >
      <ImageBackground style={style.imageContainer} source={{ uri: imageUrl }}>
        <Tile>
          <View styleName="actions" virtual>
            {renderFavorite(item)}
          </View>
        </Tile>
      </ImageBackground>
      <View style={style.textContainer}>
        <Title numberOfLines={1} style={style.title}>
          {title}
        </Title>
        <Text numberOfLines={numberOfLines} style={style.description}>
          {description}
        </Text>
      </View>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

FullGridRowItemView.propTypes = {
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  item: PropTypes.object.isRequired,
  numberOfLines: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  renderFavorite: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string,
};

FullGridRowItemView.defaultProps = {
  description: '',
  imageUrl: null,
  numberOfLines: 2,
  style: {},
  title: '',
};

const StyledFullGridRowItemView = connectStyle(ext('FullGridRowItemView'))(
  FullGridRowItemView,
);

export default React.memo(StyledFullGridRowItemView);
