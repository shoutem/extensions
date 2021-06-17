export function getCurrentDay() {
  const date = new Date();

  return date.getDay();
}

export function getCurrentHour() {
  const date = new Date();

  return date.getHours();
}

export function getCurrentBestTimeDay() {
  const today = getCurrentDay();
  // BestTime API treats 0 as Monday, Date treats 0 as Sunday.
  const bestTimeDay = today === 0 ? 6 : today - 1;

  return bestTimeDay;
}
