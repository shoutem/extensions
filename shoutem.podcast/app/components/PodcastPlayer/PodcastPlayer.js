import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Spinner, View } from '@shoutem/ui';
import {
  STATE_BUFFERING,
  STATE_CONNECTING,
  STATE_NONE,
  STATE_PAUSED,
  STATE_PLAYING,
  STATE_READY,
  STATE_STOPPED,
  TrackPlayer,
  TrackPlayerBase,
} from 'shoutem.audio';
import { ext, trackPlayerOptions } from '../../const';
import { updateDownloadedEpisode } from '../../redux';
import { getPathFromEpisode } from '../../services';
import { SKIP_BACK_TIME, SKIP_FORWARD_TIME } from './const';
import { ProgressControl } from './ProgressControl';

class PodcastPlayer extends TrackPlayerBase {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      playbackState: STATE_PAUSED,
    };
  }

  async componentDidMount() {
    const isCurrentTrack = await this.isCurrentTrack();

    if (isCurrentTrack) {
      this.handleReturnToPlayer();
    } else {
      TrackPlayer.reset();
    }
  }

  setTrackPlayerOptions() {
    this.trackPlayerOptions = trackPlayerOptions;
  }

  getId() {
    const { episode } = this.props;

    const id = episode.id || slugify(`${episode.url}`);

    return `podcast-${id}`;
  }

  addEventListeners() {
    this.jumpForwardListener = TrackPlayer.addEventListener(
      'remote-jump-forward',
      this.handleJumpForward,
    );
    this.jumpBackwardsListener = TrackPlayer.addEventListener(
      'remote-jump-backward',
      this.handleJumpBack,
    );
    this.seekToListener = TrackPlayer.addEventListener(
      'remote-seek',
      this.handleSeekToPosition,
    );

    super.addEventListeners();
  }

  handleJumpForward({ interval }) {
    this.handleSkipForward(interval);
  }

  handleJumpBack({ interval }) {
    this.handleSkipBack(interval);
  }

  handleSeekToPosition({ position }) {
    const { playbackState } = this.state;

    TrackPlayer.seekTo(position);

    if (playbackState === STATE_PAUSED) {
      TrackPlayer.play();
    }
  }

  removeEventListeners() {
    if (this.seekToListener) {
      this.seekToListener.remove();
    }

    if (this.jumpForwardListener) {
      this.jumpForwardListener.remove();
    }

    if (this.jumpBackwardsListener) {
      this.jumpBackwardsListener.remove();
    }

    super.removeEventListeners();
  }

  async addTrack() {
    const {
      downloadedEpisode,
      episode,
      podcastTitle,
      updateDownloadedEpisode,
      url,
    } = this.props;
    const { artist = podcastTitle, title } = episode;

    // Whenever an episode is played, we check for a path and update
    if (downloadedEpisode && downloadedEpisode.path && Platform.OS === 'ios') {
      updateDownloadedEpisode(downloadedEpisode);
    }

    const id = this.getId();
    const resolvedUrl = downloadedEpisode
      ? `file://${getPathFromEpisode(downloadedEpisode)}`
      : url;
    const stream = {
      id,
      url: resolvedUrl,
      title,
      artist,
    };

    // Resets the player stopping the current track and clearing the queue.
    await this.reset();
    await TrackPlayer.add(stream);
  }

  async handleSkipBack() {
    const { playbackState } = this.state;

    const position = await TrackPlayer.getPosition();
    const newPosition = Math.max(position - SKIP_BACK_TIME, 0);

    TrackPlayer.seekTo(newPosition);
    if (playbackState === STATE_PAUSED) {
      TrackPlayer.play();
    }
  }

  async handleSkipForward() {
    const { playbackState } = this.state;

    const duration = await TrackPlayer.getDuration();
    const position = await TrackPlayer.getPosition();
    const newPosition = Math.min(position + SKIP_FORWARD_TIME, duration);

    TrackPlayer.seekTo(newPosition);
    if (playbackState === STATE_PAUSED) {
      TrackPlayer.play();
    }
  }

  renderSkipIcon(iconName) {
    const { style } = this.props;
    const { currentlyActiveTrack } = this.state;

    const opacity = currentlyActiveTrack ? 1.0 : 0.5;

    return <Icon name={iconName} style={{ ...style.skipIcon, opacity }} />;
  }

  renderActionButton() {
    const {
      style: { spinnerStyle, playbackIconStyle },
    } = this.props;
    const { playbackState } = this.state;

    const actionButtons = {
      [STATE_NONE]: <Spinner style={spinnerStyle} />, // idle
      [STATE_STOPPED]: <Spinner style={spinnerStyle} />, // idle
      [STATE_BUFFERING]: <Spinner style={spinnerStyle} />, // loading
      buffering: <Spinner style={spinnerStyle} />, // no variable defined
      [STATE_READY]: <Spinner style={spinnerStyle} />, // intermediate state
      [STATE_CONNECTING]: <Spinner style={spinnerStyle} />,
      [STATE_PLAYING]: <Icon name="pause" style={playbackIconStyle} />,
      [STATE_PAUSED]: <Icon name="play" style={playbackIconStyle} />,
    };

    return actionButtons[playbackState];
  }

  render() {
    const { style } = this.props;
    const { playbackState } = this.state;
    const {
      container,
      playbackButtonStyle,
      slider,
      timeDisplay,
      skipButton,
    } = style;

    return (
      <View style={container} styleName="h-center">
        <ProgressControl
          playbackState={playbackState}
          style={{ slider, timeDisplay }}
        />
        <View styleName="horizontal h-center v-center stretch">
          <Button
            onPress={this.handleSkipBack}
            style={skipButton}
            styleName="clear"
          >
            {this.renderSkipIcon('replay-10')}
          </Button>
          <Button
            onPress={this.handleActionButtonPress}
            style={playbackButtonStyle}
          >
            {this.renderActionButton()}
          </Button>
          <Button
            onPress={this.handleSkipForward}
            style={skipButton}
            styleName="clear md-gutter-left"
          >
            {this.renderSkipIcon('forward-30')}
          </Button>
        </View>
      </View>
    );
  }
}

PodcastPlayer.propTypes = {
  downloadedEpisode: PropTypes.object,
  episode: PropTypes.object,
  podcastTitle: PropTypes.string,
  style: PropTypes.object,
  url: PropTypes.string,
};

PodcastPlayer.defaultProps = {
  podcastTitle: '-',
  enableDownload: false,
};

const mapDispatchToProps = { updateDownloadedEpisode };

export default connect(
  null,
  mapDispatchToProps,
)(connectStyle(ext('PodcastPlayer'))(PodcastPlayer));
