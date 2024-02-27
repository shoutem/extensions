import { jsonapi } from '../../shared/io';
import { loadModel } from '../../shared/db';
import { Feed } from '../data/feed-model';
import { FEED_TYPE } from './types';
import { MONITOR_TYPE } from '../../monitor/io/types';

/**
 * @swagger
 * components:
 *   schemas:
 *     FeedReference:
 *       type: object
 *       required:
 *       - type
 *       - id
 *       properties:
 *         type:
 *           type: string
 *           enum: [ shoutem.rss-monitoring.feeds ]
 *         id:
 *           type: string
 *     Feed:
 *       allOf:
 *         - $ref: '#/components/schemas/FeedReference'
 *         - type: object
 *           properties:
 *             attributes:
 *               type: object
 *               properties:
 *                 feedKey:
 *                   type: string
 *                 lastFeedItemHash:
 *                   type: string
 *             relationships:
 *               type: object
 *               properties:
 *                 monitor:
 *                   $ref: '#/components/schemas/MonitorSingleRelationship'
 *     FeedJsonApiDocument:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Feed'
 *     FeedCollectionJsonApiDocument:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Feed'
 *     FeedSingleRelationship:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/FeedReference'
 *     FeedCollectionRelationship:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FeedReference'
 */
jsonapi.registerType(FEED_TYPE, {
  load: loadModel(Feed),
  relationships: {
    monitor: {
      type: MONITOR_TYPE,
      alternativeKey: 'monitorId',
    },
  },
});
