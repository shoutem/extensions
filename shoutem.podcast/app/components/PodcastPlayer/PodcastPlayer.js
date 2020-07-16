import React, { PureComponent } from 'react';
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
  Caption,
  Divider,
  Icon,
  Button,
  Row,
  Spinner,
  View,
  Text,
} from '@shoutem/ui';

import convertSecondsToTimeDisplay from '../../services/time';
import { ext, trackPlayerOptions } from '../../const';
import { SKIP_BACK_TIME, SKIP_FORWARD_TIME } from './const';
import { ProgressControl } from './ProgressControl';

class PodcastPlayer extends TrackPlayerBase {
  constructor(props) {
    super(props);

    this.handleSkipBack = this.handleSkipBack.bind(this);
    this.handleSkipForward = this.handleSkipForward.bind(this);

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
    const { style: { skipIcon, skipIconSize} } = this.props;

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
    const { style: { spinnerStyle, playbackIconStyle }} = this.props;
    const { playbackState } = this.state;

    const actionButtons = {
      [STATE_NONE]: <Spinner style={spinnerStyle} />, // idle
      [STATE_STOPPED]: <Spinner style={spinnerStyle} />, // idle
      [STATE_BUFFERING]: <Spinner style={spinnerStyle} />, // loading
      ['buffering']: <Spinner style={spinnerStyle} />, // no variable defined
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
          style={{slider, timeDisplay}}
          playbackState={playbackState}
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
