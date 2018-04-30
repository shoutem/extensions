import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppState,
  Platform,
} from 'react-native';
import moment from 'moment';

import {
  ScrollView,
  Title,
  Video,
  Screen,
  Caption,
  Html,
  Tile,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

class VideoDetails extends Component {
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

    // When an iOS device is locked, the video pauses automatically
    // on android we have to explicitly remove it from component tree
    const isAppActive = appState === 'active';
    const isIos = Platform.OS === 'ios';
    const shouldRenderVideo = isAppActive || isIos;

    return (
      <Screen styleName="paper">
        <NavigationBar
          share={{
            title: video.name,
            link: video.video.url,
          }}
          title={video.name}
          animationName="boxing"
        />
        <ScrollView>
          {shouldRenderVideo &&
            <Video source={{ uri: video.video.url }} />
          }

          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{video.name}</Title>
            <Caption>
              {moment(video.timeCreated).fromNow()}{video.duration ? `    ${video.duration}` : ''}
            </Caption>
          </Tile>

          <Html body={video.description} />
        </ScrollView>
      </Screen>
    );
  }
}

VideoDetails.propTypes = {
  video: PropTypes.object.isRequired,
};

export default connectStyle(ext('VideoDetails'))(VideoDetails);
