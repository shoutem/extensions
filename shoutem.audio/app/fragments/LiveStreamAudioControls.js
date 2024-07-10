import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { PlaybackControl } from '../components/controls';
import { ext } from '../const';
import { useTrackPlayer, useTrackState } from '../hooks';

/**
 * A set of audio playback controls for controling live stream audio source.
 */
export const LiveStreamAudioControls = ({
  liveStream,
  isFirstPlay,
  onFirstPlay,
  style,
}) => {
  const { isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track: liveStream,
  });

  const { onPlaybackButtonPress } = useTrackPlayer({
    track: liveStream,
    isFirstPlay,
    onFirstPlay,
  });

  return (
    <View styleName="justify-center items-center md-gutter-horizontal">
      <PlaybackControl
        onPress={onPlaybackButtonPress}
        isLoadingOrBuffering={isLoadingOrBuffering}
        iconName={isActiveAndPlaying ? 'pause' : 'play'}
        style={style.playbackButton}
      />
    </View>
  );
};

LiveStreamAudioControls.propTypes = {
  isFirstPlay: PropTypes.bool,
  liveStream: PropTypes.object,
  style: PropTypes.object,
  onFirstPlay: PropTypes.func,
};

LiveStreamAudioControls.defaultProps = {
  isFirstPlay: false,
  liveStream: undefined,
  onFirstPlay: undefined,
  style: {},
};

export default connectStyle(ext('LiveStreamAudioControls'))(
  LiveStreamAudioControls,
);
