import React, { useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, View } from '@shoutem/ui';
import { ext } from '../const';
import { useSleepTimer } from '../hooks';
import { getSleepTimer } from '../redux';

/**
 * Displays the remaining time for a sleep timer and manages its countdown to automatically
 * stop audio playback when the timer reaches zero.
 */
const SleepTimer = ({ style }) => {
  const sleepTimer = useSelector(getSleepTimer);

  const {
    shouldSleep,
    isTimerActive,
    startTimer,
    clearTimer,
    timeRemaining,
    handleSleep,
  } = useSleepTimer();

  useEffect(() => {
    if (!sleepTimer) {
      clearTimer();
      return;
    }

    startTimer(sleepTimer.duration * 60000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleepTimer]);

  useEffect(() => {
    if (shouldSleep) {
      // Using pause, instead of stop, because stop removes metadata and will start playing first
      // track in queue from start. We want user to be able to continue from last played track and
      // last played position, if they decide to continue listening past sleep timer activation.
      TrackPlayer.pause();
      handleSleep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSleep]);

  if (!isTimerActive) {
    return null;
  }

  return (
    <View style={style.container}>
      <Icon name="sleep" style={style.icon} />
      <Text style={style.text}>{timeRemaining / 60000}</Text>
    </View>
  );
};

SleepTimer.propTypes = {
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('SleepTimer'))(SleepTimer);
