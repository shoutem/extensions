import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import {
  Capability,
  PlaybackControl,
  State,
  STOP_PLAYBACK_TYPE,
  TrackPlayer,
  usePlayer,
} from 'shoutem.audio';
import { PlaybackAnimation } from '../components';
import { ext, RADIO_TRACK_IDENTIFIER } from '../const';

const PLAYER_OPTIONS = {
  capabilities: [Capability.Play, Capability.Stop],
  compactCapabilities: [Capability.Play, Capability.Stop],
};

const RadioPlayer = ({ url, triggerSleep, onSleepTriggered, style }) => {
  const radioStream = {
    id: `${RADIO_TRACK_IDENTIFIER}-${slugify(`${url}`)}`,
    artist: '',
    title: '',
    url,
    isLiveStream: true,
  };

  const { isActivePlayer, playback, onPlaybackButtonPress } = usePlayer({
    tracks: [radioStream],
    updateOptions: PLAYER_OPTIONS,
    stopPlaybackType: STOP_PLAYBACK_TYPE.STOP,
  });

  useEffect(() => {
    if (triggerSleep) {
      TrackPlayer.stop();
      onSleepTriggered();
    }
  }, [onSleepTriggered, triggerSleep]);

  const isActiveAndPlaying = isActivePlayer && playback.state === State.Playing;
  const isLoadingOrBuffering =
    isActivePlayer &&
    (playback.state === State.Loading || playback.state === State.Buffering);

  return (
    <View style={style.container}>
      <PlaybackAnimation
        shouldAnimate={isActivePlayer}
        isPlaying={playback.state === State.Playing}
        isStopped={
          // We always Stop radio stream programatically, but Android devices execute Pause when using remote controls.
          playback.state === State.Stopped || playback.state === State.Paused
        }
        style={style.playbackMainCircle}
      />
      {isLoadingOrBuffering && <ActivityIndicator style={style.spinner} />}
      {!isLoadingOrBuffering && (
        <PlaybackControl
          onPress={onPlaybackButtonPress}
          iconName={isActiveAndPlaying ? 'stop' : 'play'}
          style={{
            icon: style.playbackIcon,
            container: style.playbackContainer,
          }}
        />
      )}
    </View>
  );
};

RadioPlayer.propTypes = {
  triggerSleep: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  style: PropTypes.object,
  onSleepTriggered: PropTypes.func,
};

RadioPlayer.defaultProps = {
  onSleepTriggered: _.noop,
  style: {},
};

export default connectStyle(ext('RadioPlayer'))(RadioPlayer);
