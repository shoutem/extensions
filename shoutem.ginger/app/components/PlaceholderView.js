import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Image, Text, View } from '@shoutem/ui';
import { ext } from '../const';

function PlaceholderView({ image, onButtonPress, buttonLabel, style }) {
  return (
    <View styleName="flexible paper">
      <View style={style.container}>
        <Image source={image} style={style.image} />
      </View>
      {onButtonPress && (
        <Button style={style.button} onPress={onButtonPress}>
          <Text style={style.buttonText}>{buttonLabel}</Text>
        </Button>
      )}
    </View>
  );
}

PlaceholderView.propTypes = {
  image: PropTypes.number.isRequired,
  buttonLabel: PropTypes.string,
  style: PropTypes.object,
  onButtonPress: PropTypes.func,
};

PlaceholderView.defaultProps = {
  onButtonPress: undefined,
  buttonLabel: '',
  style: {},
};

export default connectStyle(ext('PlaceholderView'))(PlaceholderView);
