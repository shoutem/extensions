import React from 'react';
import he from 'he';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Tile,
  Title,
  Caption,
  View,
  ImageBackground,
  Overlay,
  Icon,
} from '@shoutem/ui';
import getImageSource from '../services/youtube-view';

/**
 * A component used to render a single list video item with a large
 * video preview thumbnail.
 */
const LargeYoutubeView = ({ video, onPress }) => {
  // Only PlaylistItems API response contains item kind: "youtube#playlistItem"
  // that has contentDetails object (other APIs don't) & response is sorted by
  // contentDetails.videoPublishedAt
  const publishedAt =
    _.get(video, 'contentDetails.videoPublishedAt') ||
    _.get(video, 'snippet.publishedAt');
  const titleSource = he.decode(_.get(video, 'snippet.title'));

  return (
    <TouchableOpacity onPress={() => onPress(video)}>
      <Tile>
        <ImageBackground
          styleName="large-wide placeholder"
          source={{ uri: getImageSource(video) }}
        >
          <Overlay styleName="rounded-small">
            <Icon name="play" />
          </Overlay>
        </ImageBackground>

        <View styleName="content">
          <Title numberOfLines={2}>{titleSource}</Title>
          <Caption>{moment(publishedAt).fromNow()}</Caption>
        </View>
      </Tile>
    </TouchableOpacity>
  );
};

LargeYoutubeView.propTypes = {
  onPress: PropTypes.func.isRequired,
  video: PropTypes.object.isRequired,
};

export default LargeYoutubeView;
