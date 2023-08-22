import React, { PureComponent } from 'react';
import { AppState, Platform } from 'react-native';
import autoBindReact from 'auto-bind/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Screen,
  ScrollView,
  ShareButton,
  SimpleHtml,
  Tile,
  Title,
  Video,
  View,
} from '@shoutem/ui';
import { Favorite } from 'shoutem.favorites';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';
import { VIDEOS_SCHEMA } from '../redux';

export class VideoDetails extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      appState: 'active',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.appStateListener = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
    navigation.setOptions(this.getNavbarProps());
  }

  componentWillUnmount() {
    this.appStateListener.remove();
  }

  handleAppStateChange(appState) {
    this.setState({ appState });
  }

  getNavbarProps() {
    const { video } = getRouteParams(this.props);

    return {
      ...composeNavigationStyles(['boxing']),
      headerRight: this.renderHeaderRight,
      title: video.name || '',
    };
  }

  renderHeaderRight() {
    const { video, screenSettings } = getRouteParams(this.props);
    const { shareable = true } = screenSettings;

    return (
      <View styleName="horizontal">
        {shareable && (
          <ShareButton
            styleName="clear"
            title={video.name}
            url={video.video.url}
          />
        )}
        <Favorite item={video} schema={VIDEOS_SCHEMA} />
      </View>
    );
  }

  render() {
    const { appState } = this.state;
    const { video } = getRouteParams(this.props);
    // When an iOS device is locked, the video pauses automatically on android
    // we have to explicitly remove it from component tree.
    const isAppActive = appState === 'active';
    const isIos = Platform.OS === 'ios';

    // For some reason we pass an object instead of a string, so another check
    // is necessary.
    const thumbnailUrl = video.video?.thumbnailurl;
    const resolvedThumbnailUrl =
      thumbnailUrl === null ? undefined : thumbnailUrl;
    const shouldRenderVideo = isAppActive || isIos;

    return (
      <Screen styleName="paper">
        <ScrollView>
          {shouldRenderVideo && (
            <Video
              source={{ uri: video.video.url }}
              poster={resolvedThumbnailUrl}
            />
          )}
          <Tile styleName="text-centric">
            <Title styleName="md-gutter-bottom">{video.name}</Title>
            <Caption>
              {moment(video.timeCreated).fromNow()}
              {video.duration ? `    ${video.duration}` : ''}
            </Caption>
          </Tile>
          <SimpleHtml body={video.description} />
        </ScrollView>
      </Screen>
    );
  }
}

VideoDetails.propTypes = {
  navigation: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
};

export default connectStyle(ext('VideoDetails'))(VideoDetails);
