import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Caption,
  Icon,
  ImageBackground,
  Overlay,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

/**
 * A component used to render a single list video item with a large
 * video preview thumbnail.
 */
function LargeVideoView({ onPress, video }) {
  // For some reason we pass null instead of an empty string, so another check is necessary
  // for situations when the thumbnail isn't provided
  const thumbnailUrl = _.get(video, 'video.thumbnailurl');
  const resolvedThumbnailUrl = thumbnailUrl === null ? undefined : thumbnailUrl;

  const handlePress = () => {
    onPress(video);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Tile>
        <ImageBackground
          styleName="large-wide placeholder"
          source={{ uri: resolvedThumbnailUrl }}
        >
          <Overlay styleName="rounded-small">
            <Icon name="play" />
          </Overlay>
        </ImageBackground>

        <View styleName="content">
          <Title numberOfLines={2}>{video.name}</Title>
          <View styleName="horizontal space-between">
            <Caption>{moment(video.timeCreated).fromNow()}</Caption>
            <Caption>{video.duration}</Caption>
          </View>
        </View>
      </Tile>
    </TouchableOpacity>
  );
}

LargeVideoView.propTypes = {
  onPress: PropTypes.func,
  video: PropTypes.object.isRequired,
};

export default LargeVideoView;
