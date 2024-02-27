import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import { getApp } from '../../app';
import { getAppAnalytics } from '../services';
import config from '../config';

export class AnalyticsController {
  getAnalytics() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const app = getApp(req);
      const filter = io.getFilter(req) || {};
      const sort = io.getSort(req) || [];

      const limit = _.get(req, 'query.row[limit]', config.defaultAnalyticsRowLimit);
      const offset = _.get(req, 'query.row[offset]', 0);
      const page = { limit, offset };

      let dimensions = filter.dimension || [];
      if (!_.isArray(filter.dimension)) {
        dimensions = [filter.dimension];
      }

      let metrics = filter.metric || [];
      if (!_.isArray(filter.metric)) {
        metrics = [filter.metric];
      }

      const from = filter.from;
      const to = filter.to;

      const result = await getAppAnalytics(app, dimensions, metrics, from, to, page, sort);

      io.set(res, result);
    });
  }
}

export default new AnalyticsController();
