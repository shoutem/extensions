import { jsonapi } from '../../shared/io';
import { APP_TYPE } from './types';

/**
 * @swagger
 * definitions:
 *   AppReference:
 *     type: object
 *     required:
 *       - type
 *       - id
 *     properties:
 *       type:
 *         type: string
 *         enum: [ shoutem.google-analytics.apps ]
 *       id:
 *         type: string
 *   App:
 *     allOf:
 *       - $ref: "#/definitions/AppReference"
 *       - type: object
 *         properties:
 *           attributes:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *               serviceAccountKeyJson:
 *                 type: string
 *           relationships:
 *             type: object
 *             properties:
 *   AppJsonApiDocument:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         $ref: "#/definitions/App"
 *   AppCollectionJsonApiDocument:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: "#/definitions/App"
 *   AppSingleRelationship:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         $ref: "#/definitions/AppReference"
 *   AppCollectionRelationship:
 *     type: object
 *     required:
 *       - data
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: "#/definitions/AppReference"
 */
jsonapi.registerType(APP_TYPE, {
  id: 'appId',
  blacklist: ['id'],
  relationships: {},
});
