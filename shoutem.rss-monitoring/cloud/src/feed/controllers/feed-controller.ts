import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import feedRepository from '../data/feed-repository';
import { getFeed } from '../service';

export class FeedController {
  create() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const data = _.pick(io.get(req), ['feedKey', 'lastFeedItemHash', 'monitorId']);

      const feed = await feedRepository.create(data);
      io.setCreated(res, feed);
    });
  }

  update() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const feed = getFeed(req);

      const changes = _.pick(io.get(req), ['feedKey', 'lastFeedItemHash', 'monitorId']);

      const feedUpdated = await feedRepository.update(feed.id, changes);
      io.set(res, feedUpdated);
    });
  }

  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const feed = getFeed(req);
      io.set(res, feed);
    });
  }

  getAll() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const feeds = await feedRepository.getAll();
      io.set(res, feeds);
    });
  }

  find() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const filter = io.getFilter(req);
      const pageOptions = io.getPageOrDefault(req);
      const sortOptions = io.getSort(req);

      const feeds = await feedRepository.findPage(filter, sortOptions, pageOptions);

      io.set(res, feeds.getPageItems());
      io.setPage(res, feeds.getPageInfo());
    });
  }

  remove() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const feed = getFeed(req);
      await feedRepository.remove(feed.id);
      io.setEmpty(res);
    });
  }
}

export default new FeedController();
