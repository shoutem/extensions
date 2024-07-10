import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import {
  Capability,
  getActiveSource,
  LiveStreamAudioControls,
  TrackPlayer,
  updateActiveSource,
  useSetupPlayerAndOptions,
  useTrackState,
} from 'shoutem.audio';
import { AUDIO_SOURCE_TYPE } from 'shoutem.audio/const';
import { PlaybackAnimation } from '../components';
import { ext, RADIO_TRACK_IDENTIFIER } from '../const';

const PLAYER_OPTIONS = {
  capabilities: [Capability.Play, Capability.Pause],
  compactCapabilities: [Capability.Play, Capability.Pause],
};

const RadioPlayer = ({ liveStream, title, style }) => {
  const dispatch = useDispatch();

  const activeSource = useSelector(getActiveSource);

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

  const onFirstPlay = useCallback(async () => {
    await TrackPlayer.setQueue([radioStream]);

    dispatch(
      updateActiveSource({
        type: AUDIO_SOURCE_TYPE.LIVE_STREAM,
        url: radioStream.url,
        title,
      }),
    );
  }, [dispatch, radioStream, title]);

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
        isFirstPlay={activeSource?.url !== radioStream.url}
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
  style: PropTypes.object,
  title: PropTypes.string,
};

RadioPlayer.defaultProps = {
  title: '',
  style: {},
};

export default connectStyle(ext('RadioPlayer'))(RadioPlayer);
