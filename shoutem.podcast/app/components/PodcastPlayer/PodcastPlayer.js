import React from 'react';
import PropTypes from 'prop-types';
import VectorIcon from 'react-native-vector-icons/MaterialIcons';
import slugify from '@sindresorhus/slugify';

import {
  STATE_NONE,
  STATE_STOPPED,
  STATE_PAUSED,
  STATE_PLAYING,
  STATE_READY,
  STATE_BUFFERING,
  STATE_CONNECTING,
  TrackPlayer,
  TrackPlayerBase,
} from 'shoutem.audio';

import { connectStyle } from '@shoutem/theme';
import {
  Icon,
  Button,
  Spinner,
  View,
} from '@shoutem/ui';

import { ext, trackPlayerOptions } from '../../const';
import { SKIP_BACK_TIME, SKIP_FORWARD_TIME } from './const';
import { ProgressControl } from './ProgressControl';

class PodcastPlayer extends TrackPlayerBase {
  constructor(props) {
    super(props);

    this.handleSkipBack = this.handleSkipBack.bind(this);
    this.handleSkipForward = this.handleSkipForward.bind(this);

    this.handleSeekToPosition = this.handleSeekToPosition.bind(this);
    this.handleJumpBack = this.handleJumpBack.bind(this);
    this.handleJumpForward = this.handleJumpForward.bind(this);

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
    this.jumpForwardListener = TrackPlayer.addEventListener('remote-jump-forward', this.handleJumpForward);
    this.jumpBackwardsListener = TrackPlayer.addEventListener('remote-jump-backward', this.handleJumpBack);
    this.seekToListener = TrackPlayer.addEventListener('remote-seek', this.handleSeekToPosition);

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
    const { episode, url, podcastTitle } = this.props;
    const { title, artist = podcastTitle } = episode;

    const id = this.getId();

    const stream = {
      id,
      url,
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
    const newPosition = Math.max((position - SKIP_BACK_TIME), 0);

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
    const { currentlyActiveTrack } = this.state;
    const { style: { skipIcon, skipIconSize } } = this.props;

    const opacity = currentlyActiveTrack ? 1.0 : 0.5;

    return (
      <VectorIcon
        name={iconName}
        size={skipIconSize}
        style={{ ...skipIcon, opacity }}
      />
    );
  }

  renderActionButton() {
    const { style: { spinnerStyle, playbackIconStyle } } = this.props;
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
            styleName="clear md-gutter-right"
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
  episode: PropTypes.object,
  style: PropTypes.object,
  url: PropTypes.string,
  podcastTitle: PropTypes.string,
};

PodcastPlayer.defaultProps = {
  podcastTitle: '-',
};

export default connectStyle(ext('PodcastPlayer'))(PodcastPlayer);
