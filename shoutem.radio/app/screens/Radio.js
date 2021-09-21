import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { Dimensions, PixelRatio } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import {
  EmptyStateView,
  Image,
  ImageBackground,
  Overlay,
  Row,
  Screen,
  Subtitle,
  Tile,
  View,
  NAVIGATION_HEADER_HEIGHT,
  ShareButton,
} from '@shoutem/ui';
import {
  STATE_NONE, // 0 idle
  STATE_STOPPED, // 1 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_BUFFERING, // 6 buffering
  STATE_CONNECTING, // 8 connecting
} from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getCurrentRoute,
  getRouteParams,
} from 'shoutem.navigation';
import RadioPlayer from '../components/RadioPlayer';
import getWeServUrl from '../services/getWeServUrl';
import { ext } from '../const';

const overlayStyle = { marginBottom: 0 };

function getResizedImageSource(backgroundImageUrl) {
  if (!backgroundImageUrl) {
    return null;
  }

  const { width, height } = Dimensions.get('window');
  const imageWidth = PixelRatio.getPixelSizeForLayoutSize(width);
  const imageHeight = PixelRatio.getPixelSizeForLayoutSize(
    height - NAVIGATION_HEADER_HEIGHT,
  );

  return {
    uri: getWeServUrl(backgroundImageUrl, imageWidth, imageHeight),
  };
}

function renderPlaceholderView() {
  return <EmptyStateView message={I18n.t(ext('missingStreamUrl'))} />;
}

export class Radio extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      playbackState: STATE_STOPPED,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { shortcut } = getRouteParams(this.props);
    const {
      settings: { navbarTitle: title = '' },
    } = shortcut;

    navigation.setOptions({
      ...composeNavigationStyles(['clear']),
      headerRight: this.renderShare,
      title,
    });
  }

  renderShare() {
    const { shortcut } = getRouteParams(this.props);
    const {
      settings: { streamTitle, streamUrl, showSharing },
    } = shortcut;

    if (!showSharing) {
      return null;
    }
    return (
      <ShareButton
        message={`Stream address: ${streamUrl}`}
        styleName="clear"
        title={`Currently listening to ${streamTitle}`}
        url={streamUrl}
      />
    );
  }

  handleUpdatePlaybackState(playbackState) {
    this.setState({ playbackState });
  }

  resolveStatusText() {
    const { playbackState } = this.state;

    const statusTexts = {
      [STATE_NONE]: I18n.t(ext('buffering')),
      [STATE_BUFFERING]: I18n.t(ext('buffering')),
      [STATE_READY]: I18n.t(ext('buffering')), // intermediate state
      [STATE_CONNECTING]: I18n.t(ext('buffering')),
      [STATE_PLAYING]: I18n.t(ext('nowPlaying')),
      [STATE_STOPPED]: I18n.t(ext('pressToPlay')),
      [STATE_PAUSED]: I18n.t(ext('pressToPlay')),
    };

    return statusTexts[playbackState] || I18n.t(ext('buffering'));
  }

  shouldResetPlayer() {
    const { route } = this.props;
    const activeRoute = getCurrentRoute();

    if (activeRoute) {
      const isActiveShortcutRadio = activeRoute.name === ext('Radio');
      return isActiveShortcutRadio && route.key !== activeRoute.key;
    }

    return false;
  }

  render() {
    const { style } = this.props;
    const { shortcut } = getRouteParams(this.props);
    const { playbackState } = this.state;
    const {
      settings: { backgroundImageUrl, streamTitle, streamUrl },
    } = shortcut;

    if (!streamUrl) {
      return renderPlaceholderView();
    }

    const statusText = this.resolveStatusText();
    const isPlaying = playbackState === STATE_PLAYING;
    const bgImage = getResizedImageSource(backgroundImageUrl);
    // eslint-disable-next-line global-require
    const musicImage = require('../assets/music.png');
    const musicImageStyle = isPlaying ? {} : style.hiddenImage;

    return (
      <Screen>
        <ImageBackground source={bgImage} styleName="fill-parent">
          <Tile styleName="clear text-centric">
            <Overlay style={overlayStyle} styleName="fill-parent image-overlay">
              <RadioPlayer
                onPlaybackStateChange={this.handleUpdatePlaybackState}
                shouldResetPlayer={this.shouldResetPlayer()}
                title={streamTitle}
                url={streamUrl}
              />
            </Overlay>
          </Tile>
          <View style={style.nowPlaying} styleName="vertical h-center">
            <Subtitle style={style.nowPlayingText}>{statusText}</Subtitle>
            <Row style={style.clearRow}>
              <Image
                source={musicImage}
                style={musicImageStyle}
                styleName="small"
              />
              <View styleName="vertical stretch v-center">
                {isPlaying && (
                  <Subtitle style={style.streamTitle}>{streamTitle}</Subtitle>
                )}
              </View>
            </Row>
          </View>
        </ImageBackground>
      </Screen>
    );
  }
}

export default connectStyle(ext('Radio'))(Radio);
