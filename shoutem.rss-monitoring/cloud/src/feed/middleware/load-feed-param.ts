import parseIntStrict from 'parse-int';
import { asyncParamMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import feedRepository from '../data/feed-repository';
import { setFeed } from '../service';

export default function () {
  return asyncParamMiddleware(async(req, res, id) => {
    const dbId = parseIntStrict(id);
    const feed = dbId && await feedRepository.get(dbId);
    if (!feed) {
      throw new errors.NotFoundError('Feed not found',
        generateErrorCode('feed', 'notFound', 'feedNotFound'));
    }

    setFeed(req, feed);
  });
}
