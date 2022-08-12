import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import { getMonitoredShortcutsByApp } from '../../monitor/service/get-monitored-shortcuts';
import { handleRssFeedUpdateForApp } from '../../monitor/service/handle-rss-feed-update';

export class FeedController {
  sendLastFeedItem() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const data = _.pick(io.get(req), ['appId']);

      const monitoredShortcuts = await getMonitoredShortcutsByApp(data.appId);
      await handleRssFeedUpdateForApp(data.appId, monitoredShortcuts);

      io.setEmpty(res);
    });
  }
}

export default new FeedController();
