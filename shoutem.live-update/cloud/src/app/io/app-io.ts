import { jsonapi } from '../../shared/io';
import { loadModel } from '../../shared/db';
import { App } from '../data/app-model';
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
 *         enum: [ shoutem.live-update.apps ]
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
 *               appId:
 *                 type: string
 *               iosBinaryVersionName:
 *                 type: string
 *               iosBinaryVersionCode:
 *                 type: number
 *               iosBundleVersionCode:
 *                 type: number
 *               iosBundleUrl:
 *                 type: string
 *               androidBinaryVersionName:
 *                 type: string
 *               androidBinaryVersionCode:
 *                 type: number
 *               androidBundleVersionCode:
 *                 type: number
 *               androidBundleUrl:
 *                 type: string
 *               previewIosBundleUrl:
 *                 type: string
 *               previewAndroidBundleUrl:
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
  load: loadModel(App),
  id: 'appId',
  blacklist: ['id'],
  relationships: {},
});
