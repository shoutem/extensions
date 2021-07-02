import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { AppState, Platform } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Screen,
  ScrollView,
  SimpleHtml,
  Tile,
  Title,
  Video,
} from '@shoutem/ui';
import { NavigationBar } from 'shoutem.navigation';
import { ext } from '../const';

export class VideoDetails extends PureComponent {
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

  render() {
    const { shareable = true, video } = this.props;
    const { appState } = this.state;

    // When an iOS device is locked, the video pauses automatically on android we have to explicitly
    // remove it from component tree.
    const isAppActive = appState === 'active';
    const isIos = Platform.OS === 'ios';
    const shouldRenderVideo = isAppActive || isIos;

    // For some reason we pass an object instead of a string, so another check is necessary.
    const thumbnailUrl = _.get(video, 'video.thumbnailurl');
    const resolvedThumbnailUrl = (thumbnailUrl === null) ? undefined : thumbnailUrl;

    return (
      <Screen styleName="paper">
        <NavigationBar
          share={shareable ? {
            title: video.name,
            link: video.video.url,
          } : null}
          title={video.name}
          animationName="boxing"
        />
        <ScrollView>
          {shouldRenderVideo &&
            <Video
              source={{ uri: video.video.url }}
              poster={resolvedThumbnailUrl}
            />
          }
          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{video.name}</Title>
            <Caption>
              {moment(video.timeCreated).fromNow()}{video.duration ? `    ${video.duration}` : ''}
            </Caption>
          </Tile>
          <SimpleHtml body={video.description} />
        </ScrollView>
      </Screen>
    );
  }
}

VideoDetails.propTypes = {
  video: PropTypes.object.isRequired,
};

export default connectStyle(ext('VideoDetails'))(VideoDetails);
