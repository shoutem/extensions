import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { ext } from '../const';
import { connectStyle } from '@shoutem/theme';

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

/**
 * A component used to render a single list video item with a large
 * video preview thumbnail.
 */
class LargeVideoView extends React.Component {
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

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Tile>
          <ImageBackground
            styleName="large-wide placeholder"
            source={{ uri: _.get(video, 'video.thumbnailurl') }}
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

export default connectStyle(ext('LargeVideoView'))(LargeVideoView);
