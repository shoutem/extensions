import express, { Router } from 'express';
import { settingsRouter } from '../../settings';
import { actionsRouter } from '../../actions';
import { loadUserParam } from '../middleware';

const usersRouter: Router = express.Router();

usersRouter.use('/:userId/settings', settingsRouter);
usersRouter.use('/:userId/actions', actionsRouter);

usersRouter.param('userId', loadUserParam());

export {
  usersRouter,
};
