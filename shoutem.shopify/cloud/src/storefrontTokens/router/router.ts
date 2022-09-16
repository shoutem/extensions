import express, { Router } from 'express';
import controller from '../controllers/tokens-controller';

const router: Router = express.Router();

// get or create storefront API key for app
router.post(
  '/token',
  controller.create(),
);

router.get(
  '/token',
  controller.get(),
)

export {
  router,
};
