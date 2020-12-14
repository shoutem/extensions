import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { AppState, Platform } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Html,
  Screen,
  ScrollView,
  Tile,
  Title,
  Video,
  View,
} from '@shoutem/ui';

import { NavigationBar } from 'shoutem.navigation';
import { createRenderAttachment } from 'shoutem.rss';

import { ext } from '../const';

export class VimeoDetails extends PureComponent {
  static propTypes = {
    // The video article to display
    video: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

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
    this.setState({ appState });
  }

  getNavBarProps(video, videoAttachment) {
    return {
      share: {
        title: video.title,
        link: videoAttachment ? _.get(videoAttachment, 'src') : undefined,
      },
      animationName: 'boxing',
      title: video.title,
    };
  }

  render() {
    const { video } = this.props;
    const { appState } = this.state;

    const videoAttachment = _.head(video.videoAttachments);

    // When an iOS device is locked, the video pauses automatically
    // on android we have to explicitly remove it from component tree
    const isAppActive = appState === 'active';
    const isIos = Platform.OS === 'ios';
    const shouldRenderVideo = (isAppActive || isIos) && videoAttachment;


    const VideoComponent = shouldRenderVideo ?
      <Video source={{ uri: videoAttachment.src }} /> :
      null;

    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps(video, videoAttachment)} />
        <ScrollView>
          {VideoComponent}

          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{video.title}</Title>
            <Caption>{moment(video.timeCreated).fromNow()}</Caption>
          </Tile>

          <View styleName="solid">
            <Html body={video.summary} renderElement={createRenderAttachment(video, 'video')} />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('VimeoDetails'))(VimeoDetails);
