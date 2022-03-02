import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, Title, View } from '@shoutem/ui';
import { ext } from '../const';
import { StyleOptions } from '../services';

function TextContent({ title, description, textPosition, style }) {
  const textPositionStyle = StyleOptions.resolveTextPositionStyle(
    textPosition,
    style,
  );

  return (
    <View style={textPositionStyle}>
      <Title style={style.title}>{title}</Title>
      <Text numberOfLines={3} style={style.description}>
        {description}
      </Text>
    </View>
  );
}

TextContent.propTypes = {
  description: PropTypes.string.isRequired,
  textPosition: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};

TextContent.defaultProps = {
  style: {},
};

export default connectStyle(ext('TextContent'))(TextContent);
