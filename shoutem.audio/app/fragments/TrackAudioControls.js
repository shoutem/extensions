import React, { useCallback, useEffect, useRef, useState } from 'react';
import TrackPlayer, { State } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { QueueButton } from '../components';
import {
  JumpTimeControl,
  PlaybackControl,
  ProgressControl,
  SkipTrackControl,
} from '../components/controls';
import { AUDIO_SOURCE_TYPE, ext } from '../const';
import { useProgressTracking, useTrackState } from '../hooks';
import { useTrackPlayer } from '../hooks/useTrackPlayer';
import { getActiveSource } from '../redux';
import { convertSecondsToTimeDisplay } from '../services';
import { AUDIO_MODAL_VIEW } from './audio-modal/const';

/**
 * A set of audio playback controls for controling active track.
 */
export const TrackAudioControls = ({
  track,
  onQueuePress,
  isProgressControlDisabled,
  style,
}) => {
  const pressTimeoutRef = useRef(null);

  const activeSource = useSelector(getActiveSource);

  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [skipToPrevEnabled, setSkipToPrevEnabled] = useState(true);
  const [skipToNextEnabled, setSkipToNextEnabled] = useState(true);
  const [buttonPressCount, setButtonPressCount] = useState(0);

  const { position, duration } = useProgressTracking({ track });

  const onFirstPlay = useCallback(async () => TrackPlayer.setQueue([track]), [
    track,
  ]);
  const onBeforePlay = useCallback(async () => {
    // Not using State.Ended here because it does not enter Ended state always - progress and duration
    // have high amount of decimals and progress doesn't always reach duration's value.
    // Instead, if progress is less than 1 second away from duration, consider this track has ended and play
    // the track from the beggining.
    if (duration - position < 1) {
      await TrackPlayer.seekTo(0);
    }
  }, [duration, position]);

  const { playback, isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track,
  });

  useEffect(() => {
    if (
      playback.state === State.Buffering ||
      playback.state === State.Loading
    ) {
      setControlsEnabled(false);
    } else {
      setControlsEnabled(true);
    }
  }, [playback.state]);

  useEffect(() => {
    // Disable skip to prev or next, if active track is first or last in queue, respectfully.
    TrackPlayer.getQueue().then(queue => {
      if (_.head(queue)?.id === track?.id) {
        setSkipToPrevEnabled(false);
      } else {
        setSkipToPrevEnabled(true);
      }

      if (_.last(queue)?.id === track?.id) {
        setSkipToNextEnabled(false);
      } else {
        setSkipToNextEnabled(true);
      }
    });
  }, [track?.id]);

  const { onPlaybackButtonPress, onSeekComplete } = useTrackPlayer({
    track,
    onFirstPlay,
    onBeforePlay,
  });

  const handleSliderValueChange = useCallback(
    async newPosition => onSeekComplete(newPosition * duration),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duration],
  );

  // Enables users to "charge" the jump time functionality. If the jump time button is pressed multiple times,
  // the system will wait for 500ms after the last press and then jump the cumulative number of times the button was pressed.

  const handleJumpTime = async amount => {
    if (
      // Prevent jump forward when track has completed, to prevent auto-play after seek.
      amount > 0 &&
      convertSecondsToTimeDisplay(Math.floor(position)) ===
        convertSecondsToTimeDisplay(Math.floor(duration))
    ) {
      return;
    }

    clearTimeout(pressTimeoutRef.current);
    setButtonPressCount(buttonPressCount + 1);

    pressTimeoutRef.current = setTimeout(async () => {
      setControlsEnabled(false);
      // + 1 because we're checking buttonPressCount before that state is updated.
      await onSeekComplete(position + amount * (buttonPressCount + 1));

      // RNTP has small delay, it starts playing after state is set. Adding small delay for better UX.
      // Also, seeking back is slower than seeking forward, has more delay.
      setTimeout(
        () => {
          setControlsEnabled(true);
        },
        amount < 0 ? 100 : 50,
      );

      setButtonPressCount(0); // Reset count for next press sequence
    }, 500);
  };

  const handleSkipToPrevious = useCallback(async () => {
    setControlsEnabled(false);

    await TrackPlayer.skipToPrevious();
    await TrackPlayer.play();

    // RNTP has small delay, it starts playing after state is set. Adding small delay for better UX
    setTimeout(() => {
      setControlsEnabled(true);
    }, 100);
  }, []);

  const handleSkipToNext = useCallback(async () => {
    setControlsEnabled(false);

    await TrackPlayer.skipToNext();
    await TrackPlayer.play();

    // RNTP has small delay, it starts playing after state is set. Adding small delay for better UX
    setTimeout(() => {
      setControlsEnabled(true);
    }, 100);
  }, []);

  const handlePlaybackButtonPress = useCallback(async () => {
    await onPlaybackButtonPress();
  }, [onPlaybackButtonPress]);

  return (
    <>
      <View styleName="horizontal h-end md-gutter-right">
        {activeSource.type === AUDIO_SOURCE_TYPE.PLAYLIST && (
          <QueueButton
            onPress={() => onQueuePress(AUDIO_MODAL_VIEW.QUEUE_LIST)}
          />
        )}
      </View>
      <ProgressControl
        currentValue={position}
        maxValue={duration ?? 0}
        disabled={isProgressControlDisabled || !controlsEnabled}
        onValueChange={handleSliderValueChange}
      />
      <View styleName="horizontal h-center v-center stretch">
        <JumpTimeControl
          disabled={!controlsEnabled}
          iconName="replay-10"
          onPress={() => handleJumpTime(-10)}
          style={style.jumpTimeBackwardControl}
        />
        {activeSource.type === AUDIO_SOURCE_TYPE.PLAYLIST && (
          <SkipTrackControl
            onPress={handleSkipToPrevious}
            disabled={!skipToPrevEnabled || !controlsEnabled}
            style={{ button: style.skipToPrevButton }}
          />
        )}
        <View styleName="justify-center items-center sm-gutter-horizontal">
          <PlaybackControl
            onPress={handlePlaybackButtonPress}
            disabled={!controlsEnabled}
            isLoadingOrBuffering={isLoadingOrBuffering}
            iconName={isActiveAndPlaying ? 'pause' : 'play'}
            style={style.playbackButton}
          />
        </View>
        {activeSource.type === AUDIO_SOURCE_TYPE.PLAYLIST && (
          <SkipTrackControl
            onPress={handleSkipToNext}
            disabled={!skipToNextEnabled || !controlsEnabled}
            style={{ button: style.skipToNextButton }}
          />
        )}
        <JumpTimeControl
          disabled={!controlsEnabled}
          iconName="forward-30"
          onPress={() => handleJumpTime(30)}
          style={style.jumpTimeForwardControl}
        />
      </View>
    </>
  );
};

TrackAudioControls.propTypes = {
  style: PropTypes.object.isRequired,
  isProgressControlDisabled: PropTypes.bool,
  track: PropTypes.object,
  onQueuePress: PropTypes.func,
};

TrackAudioControls.defaultProps = {
  isProgressControlDisabled: false,
  track: {},
  onQueuePress: undefined,
};

export default connectStyle(ext('TrackAudioControls'))(TrackAudioControls);
