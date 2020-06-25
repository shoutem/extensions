import React, { PureComponent } from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  STATE_NONE, // 0 idle
  STATE_STOPPED, // 1 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_BUFFERING, // 6 buffering
  STATE_CONNECTING, // 8 connecting
} from 'shoutem.audio';
import { getActiveShortcut } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { NavigationBar } from 'shoutem.navigation';

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
} from '@shoutem/ui';

import getWeServUrl from '../services/getWeServUrl';
import RadioPlayer from '../components/RadioPlayer';
import { ext } from '../const';

const overlayStyle = { marginBottom: 0 };

function getResizedImageSource(backgroundImageUrl) {
  if (!backgroundImageUrl) {
    return null;
  }

  const { width, height } = Dimensions.get('window');
  const imageWidth = PixelRatio.getPixelSizeForLayoutSize(width);
  const imageHeight = PixelRatio.getPixelSizeForLayoutSize(height - NAVIGATION_HEADER_HEIGHT);

  return {
    uri: getWeServUrl(backgroundImageUrl, imageWidth, imageHeight),
  };
}

function renderPlaceholderView() {
  return <EmptyStateView message={I18n.t(ext('missingStreamUrl'))} />;
}

export class Radio extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object,
    style: PropTypes.any,
  };

  constructor(props) {
    super(props);

    this.resolveStatusText = this.resolveStatusText.bind(this);
    this.shouldResetPlayer = this.shouldResetPlayer.bind(this);
    this.handleUpdatePlaybackState = this.handleUpdatePlaybackState.bind(this);

    this.state = {
      playbackState: STATE_STOPPED,
    };
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
    const shortcutId = _.get(this.props, 'shortcut.id');
    const activeShortcutId = _.get(this.props, 'activeShortcut.id');
    const activeCanonicalName = _.get(this.props, 'activeShortcut.canonicalName');
    const isActiveShortcutRadio = activeCanonicalName === ext('Radio');

    return (isActiveShortcutRadio && shortcutId !== activeShortcutId);
  }

  render() {
    const { shortcut, style } = this.props;
    const { playbackState } = this.state;
    const {
      settings: {
        backgroundImageUrl,
        navbarTitle,
        streamTitle,
        streamUrl,
        showSharing,
      },
    } = shortcut;

    if (!streamUrl) {
      return renderPlaceholderView();
    }

    const share = showSharing ? {
      link: 'streamUrl',
      text: `Stream address: ${streamUrl}`,
      title: `Currently listening to ${streamTitle}`,
    } : null;

    const statusText = this.resolveStatusText();
    const isPlaying = playbackState === STATE_PLAYING;
    const bgImage = getResizedImageSource(backgroundImageUrl);
    const musicImage = require('../assets/music.png');
    const musicImageStyle = isPlaying ? {} : style.hiddenImage;

    return (
      <Screen styleName="full-screen">
        <NavigationBar
          share={share}
          styleName="clear"
          title={navbarTitle.toUpperCase()}
        />
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
            <Subtitle style={style.nowPlayingText}>
              {statusText}
            </Subtitle>
            <Row style={style.clearRow}>
              <Image
                source={musicImage}
                style={musicImageStyle}
                styleName="small"
              />
              <View styleName="vertical stretch v-center">
                {isPlaying && <Subtitle style={style.streamTitle}>{streamTitle}</Subtitle>}
              </View>
            </Row>
          </View>
        </ImageBackground>
      </Screen>
    );
  }
}

const mapStateToProps = state => ({
  activeShortcut: getActiveShortcut(state),
});

export default connect(mapStateToProps)(
  connectStyle(ext('Radio'))(Radio),
);
