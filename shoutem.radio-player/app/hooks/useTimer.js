import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import RNBackgroundTimer from 'react-native-background-timer';

const isAndroid = Platform.OS === 'android';

export function useTimer(interval = 60000) {
  const [timeRemaining, setTimeRemaining] = useState();
  const [intervalId, setIntervalId] = useState();

  const clearTimer = useCallback(() => {
    isAndroid
      ? RNBackgroundTimer.clearInterval(intervalId)
      : clearInterval(intervalId);
    setTimeRemaining();
  }, [intervalId]);

  const updateTimer = useCallback(() => {
    setTimeRemaining(remaining => remaining - interval);
  }, [interval]);

  const startTimer = useCallback(
    duration => {
      setTimeRemaining(duration);

      isAndroid
        ? setIntervalId(RNBackgroundTimer.setInterval(updateTimer, interval))
        : setIntervalId(setInterval(updateTimer, interval));
    },
    [interval, updateTimer],
  );

  return [clearTimer, startTimer, timeRemaining];
}
