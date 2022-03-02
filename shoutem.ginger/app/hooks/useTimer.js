import { useEffect, useState } from 'react';

export function useTimer(timeoutSeconds) {
  const [remainingTime, setRemainingTime] = useState(timeoutSeconds);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const resetTimer = () => {
    setRemainingTime(timeoutSeconds);
    setIsTimerActive(true);
  };

  useEffect(() => {
    let interval = null;

    if (isTimerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(secs => secs - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, remainingTime]);

  return [remainingTime, isTimerActive, resetTimer];
}
