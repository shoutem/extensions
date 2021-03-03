import express, { Router } from 'express';
import { loadStatusParam } from '../middleware';
import controller from '../controllers/actions-controller';

const actionsRouter: Router = express.Router();

actionsRouter.param('statusId', loadStatusParam());

actionsRouter.post(
  '/like/:statusId',
  controller.createLike(),
);

actionsRouter.post(
  '/comment/:statusId',
  controller.createComment()
);

export {
  actionsRouter,
};
