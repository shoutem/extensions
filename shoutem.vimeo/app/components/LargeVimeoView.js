import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
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
import { assets } from 'shoutem.layouts';

/**
 * A component used to render a single list video item with a large
 * video preview thumbnail.
 */
export default class LargeVimeoView extends PureComponent {
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

    const thumbnail = video.videoAttachments
      ? { uri: video.videoAttachments[0].thumbnailUrl }
      : assets.noImagePlaceholder;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Tile>
          <ImageBackground
            styleName="large-wide placeholder"
            source={thumbnail}
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

LargeVimeoView.propTypes = {
  video: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
