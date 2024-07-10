import { jsonapi } from '../../shared/io';
import { ASSET_TYPE } from './types';

/**
 * @swagger
 * definitions:
 *   AssetReference:
 *     type: object
 *     required:
 *     - type
 *     - id
 *     properties:
 *       type:
 *         type: string
 *         enum: [ shoutem.live-update.assets ]
 *       id:
 *         type: string
 *   Asset:
 *     allOf:
 *       - $ref: '#/definitions/AssetReference'
 *       - type: object
 *         properties:
 *           attributes:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *               uploadUrl:
 *                 type: string
 *               downloadUrl:
 *                 type: string
 *   AssetJsonApiDocument:
 *     type: object
 *     required:
 *     - data
 *     properties:
 *       data:
 *         $ref: '#/definitions/Asset'
 *   AssetSingleRelationship:
 *     type: object
 *     required:
 *     - data
 *     properties:
 *       data:
 *         $ref: '#/definitions/AssetReference'
 *   AssetCollectionRelationship:
 *     type: object
 *     required:
 *     - data
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: '#/definitions/AssetReference'
 */
jsonapi.registerType(ASSET_TYPE, {});
