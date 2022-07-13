import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Image, Subtitle, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../../const';

function VideoAttachment({ metadata, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={style.container}>
      <View style={style.innerContainer}>
        <Image
          source={{ uri: metadata.image || metadata.favicon }}
          style={style.image}
        />
        <View styleName="md-gutter">
          {!metadata.description && (
            <Caption
              style={style.description}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {metadata.host}
            </Caption>
          )}
          <Subtitle style={style.title} numberOfLines={2} ellipsizeMode="tail">
            {metadata.title}
          </Subtitle>
          {!!metadata.description && (
            <Caption
              style={style.description}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {metadata.description}
            </Caption>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

VideoAttachment.propTypes = {
  metadata: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

VideoAttachment.defaultProps = {
  style: {},
};

export default connectStyle(ext('VideoAttachment'))(VideoAttachment);
