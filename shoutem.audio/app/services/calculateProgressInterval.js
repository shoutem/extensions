export const calculateProgressInterval = duration => {
  const MIN_INTERVAL = 2;
  const MAX_INTERVAL = 10;

  // Any track with duration of 30 minutes or longer should have fixed 10 secs interval.
  const THRESHOLD_DURATION = 30 * 60;

  // For each 4 minutes of duration, bump interval by 1 second, but  minimum interval is 2 seconds
  // and max interval is 10 seconds.
  return duration >= THRESHOLD_DURATION
    ? MAX_INTERVAL
    : Math.max(MIN_INTERVAL, Math.ceil(duration / 240));
};
