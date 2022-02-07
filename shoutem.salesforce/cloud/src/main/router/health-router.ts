import express, { Router } from 'express';
import controller from '../controllers/health-controller';

const healthRouter: Router = express.Router();

healthRouter.get(
  '',
  controller.get()
);

export {
  healthRouter,
};
