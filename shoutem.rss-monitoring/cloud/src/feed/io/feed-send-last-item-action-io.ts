import { jsonapi } from '../../shared/io';
import { FEED_SEND_LAST_ITEM_ACTION_TYPE } from './types';

/**
 * @swagger
 * components:
 *   schemas:
 *     FeedSendLastItemAction:
 *       type: object
 *       required:
 *       - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [ feed-send-last-item-actions ]
 *         attributes:
 *           type: object
 *           properties:
 *             appId:
 *               type: string
 *     FeedSendLastItemActionJsonApiDocument:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/FeedSendLastItemAction'
 */
jsonapi.registerType(FEED_SEND_LAST_ITEM_ACTION_TYPE, {});
