import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/monitor-controller';
import { loadMonitorParam } from '../middleware';
import { MONITOR_TYPE } from '../io/types';

// eslint-disable-next-line new-cap
const monitorRouter: Router = express.Router();

/**
 * @swagger
 * parameters:
 *   monitorId:
 *     name: monitorId
 *     in: path
 *     description: monitor identifier
 *     required: true
 *     type: string
 */
monitorRouter.param('monitorId', loadMonitorParam());

/**
 * @swagger
 * /v1/monitors/all:
 *   get:
 *      summary: Returns all monitors
 *      tags:
 *      - Monitor
 *      responses:
 *        '200':
 *          description: monitor array
 *          schema:
 *          $ref: '#/components/schemas/MonitorCollectionJsonApiDocument'
 */
monitorRouter.get('/all', jsonapi.parseInput(), controller.getAll(), jsonapi.generateOutput(MONITOR_TYPE));

/**
 * @swagger
 * /v1/monitors:
 *   get:
 *     summary: Returns monitors according to provided sort, filter and page options
 *     tags:
 *     - Monitor
 *     responses:
 *       '200':
 *         description: monitor array
 *         schema:
 *           $ref: '#/components/schemas/MonitorCollectionJsonApiDocument'
 */
monitorRouter.get('/', jsonapi.parseInput(), controller.find(), jsonapi.generateOutput(MONITOR_TYPE));

/**
 * @swagger
 * /v1/monitors/{monitorId}:
 *   get:
 *     summary: Returns monitor for given id
 *     tags:
 *     - Monitor
 *     parameters:
 *     - $ref: '#/parameters/monitorId'
 *     responses:
 *       '200':
 *         description: monitor object
 *         schema:
 *           $ref: '#/components/schemas/MonitorJsonApiDocument'
 */
monitorRouter.get('/:monitorId', jsonapi.parseInput(), controller.get(), jsonapi.generateOutput(MONITOR_TYPE));

/**
 * @swagger
 * /v1/monitors:
 *   post:
 *     tags:
 *     - Monitor
 *     summary: Creates new monitor
 *     parameters:
 *     - name: monitorData
 *       in: body
 *       schema:
 *         $ref: '#/components/schemas/MonitorJsonApiDocument'
 *     responses:
 *       '201':
 *         description: created monitor object
 *         schema:
 *           $ref: '#/components/schemas/MonitorJsonApiDocument'
 */
monitorRouter.post('/', jsonapi.parseInput(MONITOR_TYPE), controller.create(), jsonapi.generateOutput(MONITOR_TYPE));

/**
 * @swagger
 * /v1/monitors/{monitorId}:
 *   patch:
 *     tags:
 *     - Monitor
 *     summary: Updates monitor
 *     parameters:
 *     - $ref: '#/parameters/monitorId'
 *     - name: monitorData
 *       in: body
 *       schema:
 *         $ref: '#/components/schemas/MonitorJsonApiDocument'
 *     responses:
 *       '200':
 *         description: updated monitor object
 *         schema:
 *           $ref: '#/components/schemas/MonitorJsonApiDocument'
 */
monitorRouter.patch(
  '/:monitorId',
  jsonapi.parseInput(MONITOR_TYPE),
  controller.update(),
  jsonapi.generateOutput(MONITOR_TYPE),
);

/**
 * @swagger
 * /v1/monitors/{monitorId}:
 *   delete:
 *     tags:
 *     - Monitor
 *     summary: Deletes monitor
 *     parameters:
 *     - $ref: '#/parameters/monitorId'
 *     responses:
 *       '204':
 *         description: no content
 */
monitorRouter.delete('/:monitorId', jsonapi.parseInput(), controller.remove(), jsonapi.generateOutput(MONITOR_TYPE));

export { monitorRouter };
