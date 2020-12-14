import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
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

    autoBindReact(this);
  }

  onPress() {
    const { onPress, video } = this.props;

    onPress(video);
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
