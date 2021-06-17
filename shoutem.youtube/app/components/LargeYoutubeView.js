import React, { PureComponent } from 'react';
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
export default class LargeYoutubeView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    video: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.video);
  }

  render() {
    const { video } = this.props;

    // Only PlaylistItems API response contains item kind: "youtube#playlistItem"
    // that has contentDetails object (other APIs don't) & response is sorted by
    // contentDetails.videoPublishedAt
    const publishedAt =
      _.get(video, 'contentDetails.videoPublishedAt') ||
      _.get(video, 'snippet.publishedAt');
    const titleSource = he.decode(_.get(video, 'snippet.title'));

    return (
      <TouchableOpacity onPress={this.onPress}>
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
  }
}
