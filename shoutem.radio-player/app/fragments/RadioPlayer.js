import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import {
  Capability,
  LiveStreamAudioControls,
  setActivePlaylistOrStream,
  TrackPlayer,
  useSetupPlayerAndOptions,
  useTrackState,
} from 'shoutem.audio';
import { PlaybackAnimation } from '../components';
import { ext, RADIO_TRACK_IDENTIFIER } from '../const';

const PLAYER_OPTIONS = {
  capabilities: [Capability.Play, Capability.Pause],
  compactCapabilities: [Capability.Play, Capability.Pause],
};

const RadioPlayer = ({
  liveStream,
  title,
  triggerSleep,
  onSleepTriggered,
  style,
}) => {
  const dispatch = useDispatch();

  const radioStream = useMemo(
    () => ({
      id: `${RADIO_TRACK_IDENTIFIER}-${slugify(`${liveStream.url}`)}`,
      url: liveStream.url,
      extensionCanonicalName: ext(),
      isLiveStream: true,
    }),
    [liveStream],
  );

  useSetupPlayerAndOptions({
    track: radioStream,
    updateOptions: PLAYER_OPTIONS,
  });

  const { isActiveAndPlaying } = useTrackState({ track: radioStream });

  const onFirstPlay = useCallback(
    () => dispatch(setActivePlaylistOrStream({ id: liveStream.url, title })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (triggerSleep) {
      TrackPlayer.stop();
      onSleepTriggered();
    }
  }, [onSleepTriggered, triggerSleep]);

  return (
    <View style={style.container}>
      <PlaybackAnimation
        shouldAnimate={isActiveAndPlaying}
        isPlaying={isActiveAndPlaying}
        isStopped={!isActiveAndPlaying}
        style={style.playbackMainCircle}
      />
      <LiveStreamAudioControls
        liveStream={radioStream}
        onFirstPlay={onFirstPlay}
        style={{
          playbackButton: {
            icon: style.playbackIcon,
            container: style.playbackContainer,
          },
        }}
      />
    </View>
  );
};

RadioPlayer.propTypes = {
  liveStream: PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  triggerSleep: PropTypes.bool.isRequired,
  style: PropTypes.object,
  title: PropTypes.string,
  onSleepTriggered: PropTypes.func,
};

RadioPlayer.defaultProps = {
  onSleepTriggered: _.noop,
  title: '',
  style: {},
};

export default connectStyle(ext('RadioPlayer'))(RadioPlayer);
