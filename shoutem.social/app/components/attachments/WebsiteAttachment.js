import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Caption, Image, TouchableOpacity, View } from '@shoutem/ui';
import { ext } from '../../const';

function WebsiteAttachment({ metadata, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style.container}>
        <Image
          source={{ uri: metadata.image || metadata.favicon }}
          style={style.image}
        />
        <View style={style.infoContainer}>
          <Caption style={style.url} numberOfLines={1}>
            {metadata.host}
          </Caption>
          <Caption style={style.title} numberOfLines={2} ellipsizeMode="tail">
            {metadata.title}
          </Caption>
        </View>
      </View>
    </TouchableOpacity>
  );
}

WebsiteAttachment.propTypes = {
  metadata: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

WebsiteAttachment.defaultProps = {
  style: {},
};

export default connectStyle(ext('WebsiteAttachment'))(WebsiteAttachment);
