import _ from 'lodash';
import uuid from 'uuid-random';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const DEFAULT_ORDER_TYPE = 'ALPHANUMERIC';

const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

function resolveOrderDimension(dimensionName, order) {
  const orderDimension: any = {
    dimension: {
      dimensionName,
      orderType: DEFAULT_ORDER_TYPE,
    },
  };

  if (order === ORDER.DESC) {
    orderDimension.desc = true;
  }

  return orderDimension;
}

function resolveOrderMetric(metricName, order) {
  const orderMetric: any = {
    metric: {
      metricName,
      orderType: DEFAULT_ORDER_TYPE,
    },
  };

  if (order === ORDER.DESC) {
    orderMetric.desc = true;
  }

  return orderMetric;
}

function resolveSort(sort, order) {
  const splitted = _.split(sort, '.');

  if (_.startsWith(sort, 'dimension.')) {
    return resolveOrderDimension(_.last(splitted), order);
  }

  if (_.startsWith(sort, 'metric.')) {
    return resolveOrderMetric(_.last(splitted), order);
  }

  return resolveOrderDimension(_.last(splitted), order);
}

function resolveOrderBys(ioSort) {
  const orderBys: any = [];

  _.forEach(ioSort, sort => {
    if (_.startsWith(sort, '-')) {
      const sortTrimmed = _.trimStart(sort, '-');
      orderBys.push(resolveSort(sortTrimmed, ORDER.DESC));

      return;
    }

    if (_.startsWith(sort, '+')) {
      const sortTrimmed = _.trimStart(sort, '-');
      orderBys.push(resolveSort(sortTrimmed, ORDER.ASC));

      return;
    }

    orderBys.push(resolveSort(sort, ORDER.ASC));
  });

  return orderBys;
}

export async function getAppAnalytics(app, dimensions, metrics, from, to, page, sort) {
  const data = {
    id: uuid(),
    dimensionHeaders: [],
    metricHeaders: [],
    rows: [],
  };

  // if keys are missing return empty data
  if (!app.propertyId || !app.serviceAccountKeyJson) {
    return data;
  }

  const analyticsDataClient = new BetaAnalyticsDataClient({ credentials: JSON.parse(app.serviceAccountKeyJson) });

  const response = await analyticsDataClient
    .runReport({
      property: `properties/${app.propertyId}`,
      orderBys: resolveOrderBys(sort),
      offset: page.offset,
      limit: page.limit,
      dateRanges: [
        {
          startDate: from,
          endDate: to,
        },
      ],
      dimensions: _.map(dimensions, dimension => ({
        name: dimension,
      })),
      metrics: _.map(metrics, metric => ({
        name: metric,
      })),
    })
    .catch(error => {
      console.log(error);
      return null;
    });

  data.rows = _.get(response, '[0].rows') || [];
  data.dimensionHeaders = _.get(response, '[0].dimensionHeaders') || [];
  data.metricHeaders = _.get(response, '[0].metricHeaders') || [];

  return data;
}
