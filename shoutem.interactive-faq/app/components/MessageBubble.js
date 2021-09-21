import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ext } from '../const';

function MessageBubble({ message, isBotMessage, style }) {
  return (
    <View style={[style.container, isBotMessage && style.botContainer]}>
      <Text style={[style.text, isBotMessage && style.botText]}>{message}</Text>
    </View>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.string,
  isBotMessage: PropTypes.bool,
  style: PropTypes.any,
};

export default connectStyle(ext('MessageBubble'))(MessageBubble);
