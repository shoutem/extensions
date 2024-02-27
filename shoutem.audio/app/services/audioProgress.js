// https://stackoverflow.com/a/1322798/1548564
export function convertSecondsToTimeDisplay(totalSeconds = 0) {
  if (totalSeconds === 0 || Number.isNaN(totalSeconds)) {
    return '0:00';
  }

  const remainingSeconds = totalSeconds % 3600;
  const hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor(remainingSeconds / 60);
  let seconds = remainingSeconds % 60;

  if (!hours) {
    minutes = String(minutes);
    seconds = String(seconds).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}
