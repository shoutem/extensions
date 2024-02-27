import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import { assertCanRead } from '../../application/middleware';
import { validateAnalytics } from '../middleware';
import '../io';
import controller from '../controllers/analytics-controller';
import { ANALYTICS_TYPE } from '../io/types';

const analyticsRouter: Router = express.Router();

/**
 * @swagger
 * /v1/apps/{appId}/analytics:
 *   get:
 *     summary: Returns analytics data
 *     tags:
 *     - Analytics
 *     parameters:
 *     - $ref: '#/parameters/appId'
 *     responses:
 *       '200':
 *         description: analytics object
 *         schema:
 *           $ref: '#/definitions/AppJsonApiDocument'
 */
analyticsRouter.get(
  '/',
  jsonapi.parseInput(),
  assertCanRead(),
  validateAnalytics(),
  controller.getAnalytics(),
  jsonapi.generateOutput(ANALYTICS_TYPE),
);

export { analyticsRouter };
