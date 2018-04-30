import React from 'react';
import PropTypes from 'prop-types';
import {
  AppState,
  Platform,
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';

import {
  ScrollView,
  Title,
  Video,
  Screen,
  Caption,
  Tile,
  View,
  Html,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

class YoutubeVideoDetailsScreen extends React.Component {
  static propTypes = {
    video: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.handleAppStateChange = this.handleAppStateChange.bind(this);

    this.state = {
      appState: 'active',
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    this.setState({
      appState,
    });
  }

  render() {
    const { video } = this.props;
    const { appState } = this.state;

    const videoSource = _.get(video, 'id.videoId');
    const titleSource = _.get(video, 'snippet.title');
    const publishedAt = _.get(video, 'snippet.publishedAt');
    const descriptionSource = _.get(video, 'snippet.description');
    const playlistVideoSource = _.get(video, 'snippet.resourceId.videoId');
    const youtubeSource = playlistVideoSource || videoSource;
    const videoUrl = `https://youtube.com/watch?v=${youtubeSource}`;

    // When an iOS device is locked, the video pauses automatically
    // on android we have to explicitly remove it from component tree
    const isAppActive = appState === 'active';
    const isIos = Platform.OS === 'ios';
    const shouldRenderVideo = isAppActive || isIos;

    return (
      <Screen styleName="paper">
        <NavigationBar
          animationName="boxing"
          share={{
            title: titleSource,
            link: videoUrl,
          }}
          title={titleSource}
        />

        <ScrollView>
          {shouldRenderVideo && (
            <Video source={{ uri: videoUrl }} />
          )}
          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{titleSource}</Title>
            <Caption>{moment(publishedAt).fromNow()}</Caption>
          </Tile>
          <View styleName="solid">
            <Html body={descriptionSource} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('YoutubeVideoDetailsScreen'))(YoutubeVideoDetailsScreen);
