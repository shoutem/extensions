import React from 'react';
import { htmlToText } from 'html-to-text';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  ImageBackground,
  Title,
  TouchableOpacity,
  View,
  Text,
} from '@shoutem/ui';
import { ext } from '../const';

export function FeaturedGrid122FullRowView({
  article,
  numberOfLines,
  onPress,
  style,
}) {
  const imageSource = { uri: article.image?.url } || undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      styleName="flexible"
      style={style.container}
    >
      <ImageBackground style={style.imageContainer} source={imageSource} />
      <View style={style.textContainer}>
        <Title numberOfLines={1} style={style.title}>
          {article.title}
        </Title>
        <Text numberOfLines={numberOfLines} style={style.description}>
          {htmlToText(article.body)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

FeaturedGrid122FullRowView.propTypes = {
  article: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  numberOfLines: PropTypes.number,
};

FeaturedGrid122FullRowView.defaultProps = {
  numberOfLines: 2,
};

export default connectStyle(ext('FeaturedGrid122FullRowView'))(
  FeaturedGrid122FullRowView,
);
