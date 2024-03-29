import React, { useCallback, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';
import { useProgressTracking, useTrackState } from '../hooks';
import { usePlaybackBehavior } from '../hooks/usePlaybackBehavior';
import { convertSecondsToTimeDisplay } from '../services';
import JumpTimeControl from './JumpTimeControl';
import PlaybackControl from './PlaybackControl';
import ProgressControl from './ProgressControl';

export const TrackAudioControls = ({
  track,
  isProgressControlDisabled,
  style,
}) => {
  const [seekInProgress, setSeekInProgress] = useState(false);

  const onBeforePlay = useCallback(async () => {
    // Not using State.Ended here because it does not enter Ended state always - progress and duration
    // have high amount of decimals and progress doesn't always reach duration's value.
    // Instead, if progress is less than 1 second away from duration, consider this track has ended and play
    // the track from the beggining.
    if (duration - position < 1) {
      await TrackPlayer.seekTo(0);
    }
  }, [duration, position]);

  const { isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track,
  });
  const { position, duration } = useProgressTracking({ track });
  const { onPlaybackButtonPress, onSeekComplete } = usePlaybackBehavior({
    track,
    onBeforePlay,
  });

  const handleSliderValueChange = useCallback(
    async newPosition => onSeekComplete(newPosition * duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duration],
  );

  const handleJumpTime = async amount => {
    if (
      // Prevent jump forward when track has completed, to prevent auto-play after seek.
      amount > 0 &&
      convertSecondsToTimeDisplay(Math.floor(position)) ===
        convertSecondsToTimeDisplay(Math.floor(duration))
    ) {
      return;
    }

    setSeekInProgress(true);
    await onSeekComplete(position + amount);
    setSeekInProgress(false);
  };

  return (
    <>
      <ProgressControl
        currentValue={position}
        maxValue={duration ?? 0}
        disabled={isProgressControlDisabled || seekInProgress}
        onValueChange={handleSliderValueChange}
      />
      <View styleName="horizontal h-center v-center stretch">
        <JumpTimeControl
          disabled={seekInProgress}
          iconName="replay-10"
          onPress={() => handleJumpTime(-10)}
          style={style.jumpTimeBackwardControl}
        />
        <View styleName="justify-center items-center md-gutter-horizontal">
          <PlaybackControl
            onPress={onPlaybackButtonPress}
            isLoadingOrBuffering={isLoadingOrBuffering}
            iconName={isActiveAndPlaying ? 'pause' : 'play'}
            style={style.playbackButton}
          />
        </View>
        <JumpTimeControl
          disabled={seekInProgress}
          iconName="forward-30"
          onPress={() => handleJumpTime(30)}
          style={style.jumpTimeForwardControl}
        />
      </View>
    </>
  );
};

TrackAudioControls.propTypes = {
  isProgressControlDisabled: PropTypes.bool,
  style: PropTypes.object,
  track: PropTypes.object,
};

TrackAudioControls.defaultProps = {
  track: undefined,
  isProgressControlDisabled: false,
  style: {},
};

export default connectStyle(ext('TrackAudioControls'))(TrackAudioControls);
