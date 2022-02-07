import express, { Router } from 'express';
import controller from '../controllers/tokens-controller';

const tokensRouter: Router = express.Router();

tokensRouter.post(
  '',
  controller.create(),
);

tokensRouter.get(
  '',
  controller.create()
);

export {
  tokensRouter,
};
