import React, { PureComponent } from 'react';
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

/**
 * A component used to render a single list video item as a row
 * in a list with a medium sized thumbnail.
 */
export default class SmallVideoView extends PureComponent {
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
        <Row>
          <ImageBackground
            styleName="medium rounded-corners placeholder"
            source={{ uri: _.get(video, 'videoAttachments[0].thumbnailUrl') }}
          >
            <Overlay styleName="rounded-small">
              <Icon name="play" />
            </Overlay>
          </ImageBackground>

          <View styleName="vertical stretch space-betwee md-gutter-horizontal">
            <Subtitle numberOfLines={3}>{video.title}</Subtitle>
            <Caption>{moment(video.timeCreated).fromNow()}</Caption>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
