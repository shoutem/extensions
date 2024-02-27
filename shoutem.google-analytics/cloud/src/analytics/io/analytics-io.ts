import { jsonapi } from '../../shared/io';
import { ANALYTICS_TYPE } from './types';

/**
 * @swagger
 * definitions:
 *   AnalyticsReference:
 *     type: object
 *     required:
 *       - type
 *       - id
 *     properties:
 *       type:
 *         type: string
 *         enum: [ shoutem.google-analytics.analytics ]
 *       id:
 *         type: string
 *   Analytics:
 *     allOf:
 *       - $ref: "#/definitions/AnalyticsReference"
 *       - type: object
 *         properties:
 *           attributes:
 *             type: object
 *             properties:
 *               dimensionHeaders:
 *                 type: object
 *               metricHeaders:
 *                 type: object
 *               rows:
 *                 type: array
 *           relationships:
 *             type: object
 *             properties:
 *   AnalyticsJsonApiDocument:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         $ref: "#/definitions/Analytics"
 *   AnalyticsCollectionJsonApiDocument:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: "#/definitions/Analytics"
 *   AnalyticsSingleRelationship:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         $ref: "#/definitions/AnalyticsReference"
 *   AnalyticsCollectionRelationship:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: "#/definitions/AnalyticsReference"
 */
jsonapi.registerType(ANALYTICS_TYPE, {
  id: 'id',
  relationships: {},
});
