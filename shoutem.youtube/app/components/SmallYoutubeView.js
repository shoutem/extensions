import React, { PureComponent } from 'react';
import he from 'he';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Row,
  Subtitle,
  Caption,
  View,
  ImageBackground,
  Overlay,
  Icon,
  Divider,
} from '@shoutem/ui';
import getImageSource from '../services/youtube-view';

/**
 * A component used to render a single list video item as a row
 * in a list with a medium sized thumbnail.
 */
export default class SmallYoutubeView extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
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
        <Row>
          <ImageBackground
            styleName="medium rounded-corners placeholder"
            source={{ uri: getImageSource(video) }}
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
}
