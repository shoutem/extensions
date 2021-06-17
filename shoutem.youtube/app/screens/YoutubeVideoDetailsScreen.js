import React, { PureComponent } from 'react';
import he from 'he';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { AppState, Platform } from 'react-native';
import { NavigationBar } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Title,
  Video,
  Screen,
  Caption,
  Tile,
  View,
  SimpleHtml,
} from '@shoutem/ui';
import { ext } from '../const';

class YoutubeVideoDetailsScreen extends PureComponent {
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

    // PlaylistItems API returns video ID value inside item.snippet.resourceId.videoId
    // Search API returns the same in item.id.videoId
    const videoSource =
      _.get(video, 'snippet.resourceId.videoId') || _.get(video, 'id.videoId');
    const titleSource = he.decode(_.get(video, 'snippet.title'));
    const publishedAt = _.get(video, 'snippet.publishedAt');
    const descriptionSource = _.get(video, 'snippet.description');
    const videoUrl = `https://youtube.com/watch?v=${videoSource}`;

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
          {shouldRenderVideo && <Video source={{ uri: videoUrl }} />}
          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{titleSource}</Title>
            <Caption>{moment(publishedAt).fromNow()}</Caption>
          </Tile>
          <View styleName="solid">
            <SimpleHtml body={descriptionSource} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('YoutubeVideoDetailsScreen'))(
  YoutubeVideoDetailsScreen,
);
