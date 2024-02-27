import { jsonapi } from '../../shared/io';
import { loadModel } from '../../shared/db';
import { Monitor } from '../data/monitor-model';
import { MONITOR_TYPE } from './types';

/**
 * @swagger
 * components:
 *   schemas:
 *     MonitorReference:
 *       type: object
 *       required:
 *       - type
 *       - id
 *       properties:
 *         type:
 *           type: string
 *           enum: [ shoutem.rss-monitoring.monitors ]
 *         id:
 *           type: string
 *     Monitor:
 *       allOf:
 *         - $ref: '#/components/schemas/MonitorReference'
 *         - type: object
 *           properties:
 *             attributes:
 *               type: object
 *               properties:
 *                 appId:
 *                   type: string
 *             relationships:
 *               type: object
 *               properties:
 *     MonitorJsonApiDocument:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Monitor'
 *     MonitorCollectionJsonApiDocument:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Monitor'
 *     MonitorSingleRelationship:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/MonitorReference'
 *     MonitorCollectionRelationship:
 *       type: object
 *       required:
 *       - data
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MonitorReference'
 */
jsonapi.registerType(MONITOR_TYPE, {
  load: loadModel(Monitor),
});
