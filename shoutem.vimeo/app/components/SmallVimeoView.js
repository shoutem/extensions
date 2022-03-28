import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
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

/**
 * A component used to render a single list video item as a row
 * in a list with a medium sized thumbnail.
 */
export default class SmallVimeoView extends PureComponent {
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
        <Row>
          <ImageBackground
            styleName="medium rounded-corners placeholder"
            source={thumbnail}
          >
            <Overlay styleName="rounded-small">
              <Icon name="play" />
            </Overlay>
          </ImageBackground>

          <View styleName="vertical stretch space-between md-gutter-horizontal">
            <Subtitle numberOfLines={3}>{video.title}</Subtitle>
            <Caption>{moment(video.timeCreated).fromNow()}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

SmallVimeoView.propTypes = {
  video: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
