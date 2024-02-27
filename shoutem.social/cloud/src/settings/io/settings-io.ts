import { loadModel } from '../../shared/db';
import { jsonapi } from '../../shared/io';
import { Settings } from '../data/settings-model';
import { SETTINGS_TYPE } from './types';

/**
 * @swagger
 * components:
 *   schemas:
 *     SettingsReference:
 *       type: object
 *       required:
 *       - type
 *       - id
 *       properties:
 *         type:
 *           type: string
 *           enum: [ settings ]
 *         id:
 *           type: string
 *     Settings:
 *       allOf:
 *         - $ref: '#/components/schemas/SettingsReference'
 *         - type: object
 *           properties:
 *             attributes:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 commentsOnMyStatuses:
 *                   type: boolean
 *                 likesOnMyStatuses:
 *                   type: boolean
 *                 commentsOnCommentedStatuses:
 *                   type: boolean
 *                 commentsOnLikedStatuses:
 *                   type: boolean
 *             relationships:
 *               type: object
 *               properties:
 *     SettingsJsonApiDocument:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Settings'
 *     SettingsCollectionJsonApiDocument:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Settings'
 *     SettingsSingleRelationship:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/SettingsReference'
 *     SettingsCollectionRelationship:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SettingsReference'
 */
jsonapi.registerType(SETTINGS_TYPE, {
  load: loadModel(Settings),
});
