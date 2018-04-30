import PropTypes from 'prop-types';
import React from 'react';
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

/**
 * A component used to render a single list video item with a large
 * video preview thumbnail.
 */
export default class LargeVimeoView extends React.Component {
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
            source={{ uri: _.get(video, 'videoAttachments[0].thumbnailUrl') }}
          >
            <Overlay styleName="rounded-small">
              <Icon name="play" />
            </Overlay>
          </ImageBackground>

          <View styleName="content">
            <Title numberOfLines={2}>{video.title}</Title>
            <Caption>{moment(video.timeCreated).fromNow()}</Caption>
          </View>
        </Tile>
      </TouchableOpacity>
    );
  }
}
