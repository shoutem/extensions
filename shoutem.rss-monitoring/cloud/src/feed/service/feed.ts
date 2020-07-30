import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { Feed } from '../data/feed-model';
import { FEED_LOCALS_PATH } from '../const';

export function getFeed(req: Request): Feed {
  return getLocals<Feed>(req, FEED_LOCALS_PATH);
}

export function setFeed(req: Request, feed: Feed): void {
  setLocals(req, FEED_LOCALS_PATH, feed);
}
