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

import getImageSource from '../services/youtube-view';

/**
 * A component used to render a single list video item with a large
 * video preview thumbnail.
 */
export default class LargeYoutubeView extends React.Component {
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
    const titleSource = _.get(video, 'snippet.title');
    const publishedAt = _.get(video, 'snippet.publishedAt');

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
