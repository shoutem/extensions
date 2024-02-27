import { ext } from '../../../const';
import { moduleName } from '../const';

function getAnalyticsState(state) {
  return state[ext()][moduleName];
}

export function getAppAnalytics(state) {
  const analyticsState = getAnalyticsState(state);
  return analyticsState?.app;
}
