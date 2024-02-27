import { get } from 'lodash';
import moment from 'moment';
import { PLATFORM } from '../const';

export function formatGraphData(data) {
  return Object.values(get(data, 'data', []));
}

export function formatXAxisLabels(date, filter) {
  if (filter === 'hour') {
    return moment(date).format('HH:mm');
  }

  if (filter === 'day') {
    return moment(date).format('MM-DD');
  }

  if (filter === 'week') {
    return moment(date).format('MM-DD');
  }

  if (filter === 'month') {
    return moment(date).format('YYYY-MM');
  }

  return moment(date).format('YYYY');
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatAnalyticsPercentagesByPlatform(category) {
  const total = get(category, 'total', 1) || 1;

  return {
    iosPercent: formatPercent(get(category, PLATFORM.IOS, 0) / total),
    androidPercent: formatPercent(get(category, PLATFORM.ANDROID, 0) / total),
  };
}
