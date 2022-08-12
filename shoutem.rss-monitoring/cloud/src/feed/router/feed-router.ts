import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/feed-controller';
import { FEED_SEND_LAST_ITEM_ACTION_TYPE } from '../io/types';

const feedRouter: Router = express.Router();

feedRouter.post(
  '/actions/send-last-feed-item',
  jsonapi.parseInput(FEED_SEND_LAST_ITEM_ACTION_TYPE),
  controller.sendLastFeedItem(),
  jsonapi.generateOutput(FEED_SEND_LAST_ITEM_ACTION_TYPE),
);

export { feedRouter };
