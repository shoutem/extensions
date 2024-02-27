import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/feed-controller';
import { FEED_SEND_LAST_ITEM_ACTION_TYPE } from '../io/types';

const feedRouter: Router = express.Router();

/**
 * @swagger
 * /v1/feeds/actions/send-last-feed-item:
 *   post:
 *     summary: Send last feed item
 *     tags:
 *     - Feed
 *     parameters:
 *     - name: send last feed item data
 *       in: body
 *       schema:
 *         $ref: '#/components/schemas/FeedSendLastItemAction'
 *     responses:
 *       '204':
 *         description: no content
 */
feedRouter.post(
  '/actions/send-last-feed-item',
  jsonapi.parseInput(FEED_SEND_LAST_ITEM_ACTION_TYPE),
  controller.sendLastFeedItem(),
  jsonapi.generateOutput(FEED_SEND_LAST_ITEM_ACTION_TYPE),
);

export { feedRouter };
