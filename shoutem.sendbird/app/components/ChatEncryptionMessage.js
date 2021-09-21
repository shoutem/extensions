import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View, Image } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images } from '../assets';
import { ext } from '../const';

function ChatEncryptionMessage({ style }) {
  return (
    <View styleName="horizontal h-center">
      <View style={style.container} styleName="horizontal v-start h-center">
        <Image source={images.lock} style={style.image} />
        <Text style={style.text}>{I18n.t(ext('chatEncryptionMessage'))}</Text>
      </View>
    </View>
  );
}

ChatEncryptionMessage.propTypes = {
  style: PropTypes.object,
};

export default connectStyle(ext('ChatEncryptionMessage'))(
  ChatEncryptionMessage,
);
