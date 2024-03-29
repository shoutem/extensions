import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';
import { usePlaybackBehavior, useTrackState } from '../hooks';
import PlaybackControl from './PlaybackControl';

export const LiveStreamAudioControls = ({ liveStream, onFirstPlay, style }) => {
  const { isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track: liveStream,
  });
  const { onPlaybackButtonPress } = usePlaybackBehavior({
    track: liveStream,
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
  liveStream: PropTypes.object,
  style: PropTypes.object,
  onFirstPlay: PropTypes.func,
};

LiveStreamAudioControls.defaultProps = {
  liveStream: undefined,
  onFirstPlay: undefined,
  style: {},
};

export default connectStyle(ext('LiveStreamAudioControls'))(
  LiveStreamAudioControls,
);
