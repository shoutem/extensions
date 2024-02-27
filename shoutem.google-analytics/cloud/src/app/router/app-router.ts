import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import { loadApplicationParam, assertCanUpdate } from '../../application/middleware';
import { analyticsRouter } from '../../analytics';
import '../io';
import controller from '../controllers/app-controller';
import { loadOrCreateAppParam } from '../middleware';
import { APP_TYPE } from '../io/types';

const appRouter: Router = express.Router();

/**
 * @swagger
 * parameters:
 *   appId:
 *     name: appId
 *     in: path
 *     description: app identifier
 *     required: true
 *     type: string
 */
// loading application from app manager first !!!
appRouter.param('appId', loadApplicationParam());
appRouter.param('appId', loadOrCreateAppParam());

appRouter.use('/:appId/analytics', analyticsRouter);

/**
 * @swagger
 * /v1/apps/{appId}:
 *   get:
 *     summary: Returns app for given id
 *     tags:
 *     - App
 *     parameters:
 *     - $ref: '#/parameters/appId'
 *     responses:
 *       '200':
 *         description: app object
 *         schema:
 *           $ref: '#/definitions/AppJsonApiDocument'
 */
appRouter.get(
  '/:appId', //
  jsonapi.parseInput(),
  assertCanUpdate(),
  controller.get(),
  jsonapi.generateOutput(APP_TYPE),
);

/**
 * @swagger
 * /v1/apps/{appId}:
 *   patch:
 *     tags:
 *     - App
 *     summary: Updates app
 *     parameters:
 *     - $ref: '#/parameters/appId'
 *     - name: appData
 *       in: body
 *       schema:
 *         $ref: '#/definitions/AppJsonApiDocument'
 *     responses:
 *       '200':
 *         description: updated app object
 *         schema:
 *           $ref: '#/definitions/AppJsonApiDocument'
 */
appRouter.patch(
  '/:appId', //
  jsonapi.parseInput(APP_TYPE),
  assertCanUpdate(),
  controller.update(),
  jsonapi.generateOutput(APP_TYPE),
);

export { appRouter };
