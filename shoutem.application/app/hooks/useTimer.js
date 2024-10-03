import { useCallback, useState } from 'react';
import RNBackgroundTimer from 'react-native-background-timer';
import { isAndroid } from 'shoutem-core';
/**
 * Custom hook for managing timers, with support for background timer on Android.
 *
 * The hook provides methods and state for managing timers, including starting,
 * clearing, and getting the remaining time.
 *
 * @param {number} [interval=60000] - The interval (in milliseconds) for the timer.
 * @returns {Array} Array of
 * @property {function} clearTimer - Function to clear (stop) the timer.
 * @property {function} startTimer - Function to start the timer with a specified duration.
 * @property {number} timeRemaining - Time remaining in the timer in milliseconds.
 */
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
