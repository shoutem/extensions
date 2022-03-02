import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, Title, View } from '@shoutem/ui';
import { ext } from '../const';
import { StyleOptions } from '../services';

function ImageContent({
  title,
  description,
  featuredImage,
  textPosition,
  style,
}) {
  const isTextPositionTop =
    textPosition?.value === StyleOptions.TEXT_POSITIONS.TOP;

  return (
    <View style={style.container}>
      {isTextPositionTop && (
        <View style={style.topTextContainer}>
          <Title style={style.title}>{title}</Title>
          <Text numberOfLines={3} style={style.description}>
            {description}
          </Text>
        </View>
      )}
      <Image source={featuredImage} style={style.featuredImage} />
      {!isTextPositionTop && (
        <View style={style.bottomTextContainer}>
          <Title style={style.title}>{title}</Title>
          <Text numberOfLines={3} style={style.description}>
            {description}
          </Text>
        </View>
      )}
    </View>
  );
}

ImageContent.propTypes = {
  description: PropTypes.string.isRequired,
  featuredImage: PropTypes.number.isRequired,
  textPosition: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};

ImageContent.defaultProps = {
  style: {},
};

export default connectStyle(ext('ImageContent'))(ImageContent);
