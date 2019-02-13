import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';

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

import { ext } from '../const';

/**
 * A component used to render a single list video item with a large
 * video preview thumbnail.
 */
export default class LargeVideoView extends PureComponent {
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

    // For some reason we pass null instead of an empty string, so another check is necessary
    // for situations when the thumbnail isn't provided
    const thumbnailUrl = _.get(video, 'video.thumbnailurl');
    const resolvedThumbnailUrl = (thumbnailUrl === null) ? undefined : thumbnailUrl;

    return (
      <TouchableOpacity onPress={this.onPress}>
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
}
