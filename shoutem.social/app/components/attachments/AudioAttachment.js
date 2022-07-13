import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Icon, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../../const';

function AudioAttachment({ audioUrl, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={style.container}>
      <View style={style.contentContainer}>
        <Icon name="download" style={style.icon} />
        <Caption
          style={style.audioTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {audioUrl}
        </Caption>
      </View>
    </TouchableOpacity>
  );
}

AudioAttachment.propTypes = {
  audioUrl: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

AudioAttachment.defaultProps = {
  style: {},
};

export default connectStyle(ext('AudioAttachment'))(AudioAttachment);
