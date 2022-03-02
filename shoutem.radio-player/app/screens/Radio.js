import React, { PureComponent } from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  EmptyStateView,
  Image,
  ImageBackground,
  Overlay,
  Row,
  Screen,
  ShareButton,
  Subtitle,
  Tile,
  View,
} from '@shoutem/ui';
import {
  STATE_BUFFERING, // 6 buffering
  STATE_CONNECTING, // 8 connecting
  STATE_NONE, // 0 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_STOPPED, // 1 idle
} from 'shoutem.audio';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getCurrentRoute,
  getRouteParams,
} from 'shoutem.navigation';
import { images } from '../assets';
import RadioPlayer from '../components/RadioPlayer';
import { ext } from '../const';
import { setTrackMetadata } from '../redux';
import { getResizedImageSource, getTrackArtwork } from '../services';

const overlayStyle = { marginBottom: 0 };

function renderPlaceholderView() {
  return <EmptyStateView message={I18n.t(ext('missingStreamUrl'))} />;
}

export class Radio extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      playbackState: STATE_STOPPED,
      artist: '',
      songName: '',
      artwork: '',
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

  renderShare(props) {
    const { shortcut } = getRouteParams(this.props);
    const {
      settings: { streamTitle, streamUrl, showSharing },
    } = shortcut;

    if (!showSharing) {
      return null;
    }
    return (
      <ShareButton
        message={I18n.t(ext('shareMessage'), { streamUrl })}
        styleName="clear"
        title={I18n.t(ext('shareTitle'), { streamTitle })}
        url={streamUrl}
        iconProps={{ style: props.tintColor }}
      />
    );
  }

  handleUpdatePlaybackState(playbackState) {
    this.setState({ playbackState });
  }

  async handleMetadataChange(metadata, manually = false) {
    const { setTrackMetadata } = this.props;
    const {
      shortcut: {
        settings: { streamUrl },
      },
    } = getRouteParams(this.props);
    const { artist = '', title = '' } = metadata;

    if (manually) {
      LayoutAnimation.easeInEaseOut();
      this.setState(metadata);
      return;
    }

    const artwork = await getTrackArtwork(title);
    const resolvedImage = artwork ? { uri: artwork } : images.music;

    const updates = {
      artist,
      songName: title,
      artwork: resolvedImage,
    };

    const id = slugify(`${streamUrl}`);

    setTrackMetadata(`radio-${id}`, updates);

    LayoutAnimation.easeInEaseOut();
    this.setState(updates);
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
    const {
      settings: { backgroundImageUrl, streamTitle, streamUrl, showArtwork },
    } = shortcut;
    const { playbackState, artist, songName, artwork } = this.state;

    if (!streamUrl) {
      return renderPlaceholderView();
    }

    const statusText = this.resolveStatusText();
    const isPlaying = playbackState === STATE_PLAYING;
    const bgImage = getResizedImageSource(backgroundImageUrl);
    // eslint-disable-next-line global-require
    const artworkStyle = isPlaying ? {} : style.hiddenImage;

    return (
      <Screen>
        <ImageBackground source={bgImage} styleName="fill-parent">
          <Tile styleName="clear text-centric">
            <Overlay style={overlayStyle} styleName="fill-parent image-overlay">
              <RadioPlayer
                onPlaybackStateChange={this.handleUpdatePlaybackState}
                onMetadataStateChange={this.handleMetadataChange}
                shouldResetPlayer={this.shouldResetPlayer()}
                title={streamTitle}
                url={streamUrl}
              />
            </Overlay>
          </Tile>
          <View style={style.nowPlaying} styleName="vertical h-center">
            <Subtitle style={style.nowPlayingText}>{statusText}</Subtitle>
            <Row style={style.clearRow}>
              {!!showArtwork && (
                <Image
                  source={artwork}
                  style={artworkStyle}
                  styleName="small"
                />
              )}
              <View styleName="vertical stretch v-center">
                {isPlaying && (
                  <View styleName="vertical stretch v-start">
                    <Subtitle style={style.artistName}>{artist}</Subtitle>
                    <Subtitle style={style.songName}>{songName}</Subtitle>
                  </View>
                )}
              </View>
            </Row>
          </View>
        </ImageBackground>
      </Screen>
    );
  }
}

Radio.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  setTrackMetadata: PropTypes.func.isRequired,
  style: PropTypes.object,
};

Radio.defaultProps = {
  style: {},
};

const mapDispatchToProps = {
  setTrackMetadata,
};

export default connect(
  null,
  mapDispatchToProps,
)(connectStyle(ext('RadioPlayer'))(Radio));
