import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/monitor-controller';
import { loadMonitorParam } from '../middleware';
import { MONITOR_TYPE } from '../io/types';

// eslint-disable-next-line new-cap
const monitorRouter: Router = express.Router();

monitorRouter.param('monitorId', loadMonitorParam());

monitorRouter.get(
  '/all', //
  jsonapi.parseInput(),
  controller.getAll(),
  jsonapi.generateOutput(MONITOR_TYPE),
);

monitorRouter.get(
  '/', //
  jsonapi.parseInput(),
  controller.find(),
  jsonapi.generateOutput(MONITOR_TYPE),
);

monitorRouter.get(
  '/:monitorId', //
  jsonapi.parseInput(),
  controller.get(),
  jsonapi.generateOutput(MONITOR_TYPE),
);

monitorRouter.post(
  '/', //
  jsonapi.parseInput(MONITOR_TYPE),
  controller.create(),
  jsonapi.generateOutput(MONITOR_TYPE),
);

monitorRouter.patch(
  '/:monitorId', //
  jsonapi.parseInput(MONITOR_TYPE),
  controller.update(),
  jsonapi.generateOutput(MONITOR_TYPE),
);

monitorRouter.delete(
  '/:monitorId', //
  jsonapi.parseInput(),
  controller.remove(),
  jsonapi.generateOutput(MONITOR_TYPE),
);

export { monitorRouter };
