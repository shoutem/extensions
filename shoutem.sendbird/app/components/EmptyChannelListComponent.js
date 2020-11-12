import PropTypes from 'prop-types';
import React from 'react';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Text, View, Image } from '@shoutem/ui';
import { images } from '../assets';
import { ext } from '../const';

function EmptyChannelListComponent({ style }) {
  return (
    <View styleName="vertical h-center">
      <Image source={images.emptyList} style={style.image} />
      <Text style={style.title}>{I18n.t(ext('emptyChatListTitle'))}</Text>
      <Text style={style.description} styleName="h-center">
        {I18n.t(ext('emptyChatListMessage'))}
      </Text>
    </View>
  );
}

EmptyChannelListComponent.propTypes = {
  style: PropTypes.object,
};

export default connectStyle(ext('EmptyChannelListComponent'))(EmptyChannelListComponent);
