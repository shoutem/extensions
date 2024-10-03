import { useCallback, useEffect, useState } from 'react';
import { Toast } from '@shoutem/ui';
import { unavailableInWeb, useTimer } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

/**
 * Custom hook for managing the sleep timer functionality.
 *
 * @returns {object} Object
 * @property {boolean} shouldSleep - Indicates if the sleep timer has finished.
 * @property {boolean} isTimerActive - Indicates if the sleep timer is currently running.
 * @property {function} startTimer - Function to start the sleep timer.
 * @property {function} clearTimer - Function to clear (stop) the sleep timer.
 * @property {number} timeRemaining - Time remaining in the sleep timer in milliseconds.
 * @property {function} handleSleep - Function to handle the sleep action and show information toast.
 */
export const useSleepTimer = () => {
  const [shouldSleep, setShouldSleep] = useState(false);
  const [clearTimer, startTimer, timeRemaining] = useTimer(60000);

  const isTimerActive = timeRemaining && timeRemaining > 0;

  useEffect(() => {
    if (timeRemaining === 0) {
      setShouldSleep(true);
      clearTimer();
    }
  }, [clearTimer, timeRemaining]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSleep = useCallback(
    unavailableInWeb(() => {
      setShouldSleep(false);

      // Display information about the graceful radio stop to provide clarity to the user.
      // This way, if they are on another screen, they won't mistake it for buffering or an error.
      Toast.showInfo({
        title: I18n.t(ext('sleepTimerToastTitle')),
        message: I18n.t(ext('sleepTimerToastMessage')),
        iconName: 'clock',
      });
    }),
    [],
  );

  return {
    shouldSleep,
    isTimerActive,
    startTimer,
    clearTimer,
    timeRemaining,
    handleSleep,
  };
};
