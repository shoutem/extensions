import React from 'react';
import PropTypes from 'prop-types';
import slugify from '@sindresorhus/slugify';

import {
  STATE_NONE, // 0 idle
  STATE_STOPPED, // 1 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_BUFFERING, // 6 buffering
  STATE_CONNECTING, // 8 connecting
  TrackPlayer,
  TrackPlayerBase,
} from 'shoutem.audio';

import { Capability, State } from 'react-native-track-player';

import { connectStyle } from '@shoutem/theme';
import { Icon, Button, Spinner } from '@shoutem/ui';

import { ext, trackPlayerOptions } from '../const';

const { bool, func, string } = PropTypes;

class RadioPlayer extends TrackPlayerBase {
  static propTypes = {
    shouldResetPlayer: bool,
    onPlaybackStateChange: func,
    title: string,
    url: string,
  };

  constructor(props) {
    super(props);

    this.resolveActionIcon = this.resolveActionIcon.bind(this);

    this.setTrackPlayerOptions();
  }

  async componentDidUpdate() {
    const { onPlaybackStateChange, shouldResetPlayer } = this.props;
    const { playbackState } = this.state;

    const isCurrentTrack = await this.isCurrentTrack();
    const isPlaying = playbackState === STATE_PLAYING;

    if (isCurrentTrack && shouldResetPlayer) {
      this.firstPlay = true;
      onPlaybackStateChange(STATE_STOPPED);

      if (isPlaying) {
        TrackPlayer.reset();
      }
    }
  }

  setTrackPlayerOptions() {
    this.trackPlayerOptions = trackPlayerOptions;
  }

  getId() {
    const { title, url } = this.props;

    const id = slugify(`${title}-${url}`);

    return `radio-${id}`;
  }

  async addTrack() {
    const { title, url } = this.props;

    const id = this.getId();

    const stream = {
      artist: title,
      id,
      title,
      url,
    };

    // Resets the player stopping the current track and clearing the queue.
    await this.reset();
    await TrackPlayer.add(stream);
  }

  handlePlaybackStateChange(data) {
    const { onPlaybackStateChange } = this.props;

    super.handlePlaybackStateChange(data);
    onPlaybackStateChange(data.state);
  }

  async handleReturnToPlayer() {
    const { onPlaybackStateChange } = this.props;

    if (await TrackPlayer.getCurrentTrack()) {
      this.firstPlay = false;
    }

    this.setAsActiveTrack();
    this.setPlaybackState(STATE_BUFFERING);
    const playbackState = await TrackPlayer.getState();
    this.setPlaybackState(playbackState);
    this.addEventListeners();
    onPlaybackStateChange(playbackState);
  }

  resolveActionIcon() {
    const { style: { playbackIcon, spinner }} = this.props;
    const { playbackState } = this.state;

    const icons = {
      [STATE_NONE]: <Spinner style={spinner} />,
      [STATE_BUFFERING]: <Spinner style={spinner} />,
      [STATE_READY]: <Spinner style={spinner} />, // intermediate state
      [STATE_PLAYING]: <Icon name="pause" style={playbackIcon} />,
      [STATE_STOPPED]: <Icon name="play" style={playbackIcon} />,
      [STATE_PAUSED]: <Icon name="play" style={playbackIcon} />,
    };

    return icons[playbackState] || <Spinner style={spinner} />;
  }

  render() {
    const { style: { playbackButton }} = this.props;

    const ActionIcon = this.resolveActionIcon;

    return (
      <Button
        onPress={this.handleActionButtonPress}
        style={playbackButton}
      >
        <ActionIcon />
      </Button>
    );
  }
}

export default connectStyle(ext('RadioPlayer'))(RadioPlayer);
