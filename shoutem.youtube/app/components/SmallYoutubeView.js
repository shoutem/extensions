import React from 'react';
import he from 'he';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Caption,
  Divider,
  Icon,
  ImageBackground,
  Overlay,
  Row,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { assets } from 'shoutem.layouts';
import getImageSource from '../services/youtube-view';

/**
 * A component used to render a single list video item as a row
 * in a list with a medium sized thumbnail.
 */
export default function SmallYoutubeView({ video, onPress }) {
  // Only PlaylistItems API response contains item kind: "youtube#playlistItem"
  // that has contentDetails object (other APIs don't) & response is sorted by
  // contentDetails.videoPublishedAt
  const publishedAt =
    _.get(video, 'contentDetails.videoPublishedAt') ||
    _.get(video, 'snippet.publishedAt');
  const titleSource = he.decode(_.get(video, 'snippet.title'));
  const imageSource = getImageSource(video);

  const videoImage = imageSource
    ? { uri: imageSource }
    : assets.noImagePlaceholder;

  return (
    <TouchableOpacity onPress={() => onPress(video)}>
      <Row>
        <ImageBackground
          styleName="medium rounded-corners placeholder"
          source={videoImage}
        >
          <Overlay styleName="rounded-small">
            <Icon name="play" />
          </Overlay>
        </ImageBackground>

        <View styleName="vertical stretch space-between md-gutter-horizontal">
          <Subtitle numberOfLines={3}>{titleSource}</Subtitle>
          <Caption>{moment(publishedAt).fromNow()}</Caption>
        </View>
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

SmallYoutubeView.propTypes = {
  video: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
