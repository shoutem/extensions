import express from 'express';
import { name, version } from '../../package.json';

const healthRouter = new express.Router();

/**
 * @swagger
 * /v1/health:
 *   get:
 *     summary: Checks health status
 *     tags:
 *     - Health
 *     responses:
 *       '200':
 *         description: fetches health status
 */
healthRouter.get('/', (req, res) => {
  const data = {
    name,
    version,
    status: 'up',
    timestamp: new Date(),
    uptime: process.uptime(),
  };

  res.status(200).send(data);
});

export { healthRouter };
