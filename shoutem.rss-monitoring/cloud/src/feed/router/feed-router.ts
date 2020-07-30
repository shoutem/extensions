import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/feed-controller';
import { loadFeedParam } from '../middleware';
import { FEED_TYPE } from '../io/types';

const feedRouter: Router = express.Router();

feedRouter.param('feedId', loadFeedParam());

feedRouter.get(
  '/all', //
  jsonapi.parseInput(),
  controller.getAll(),
  jsonapi.generateOutput(FEED_TYPE),
);

feedRouter.get(
  '/', //
  jsonapi.parseInput(),
  controller.find(),
  jsonapi.generateOutput(FEED_TYPE),
);

feedRouter.get(
  '/:feedId', //
  jsonapi.parseInput(),
  controller.get(),
  jsonapi.generateOutput(FEED_TYPE),
);

feedRouter.post(
  '/', //
  jsonapi.parseInput(FEED_TYPE),
  controller.create(),
  jsonapi.generateOutput(FEED_TYPE),
);

feedRouter.patch(
  '/:feedId', //
  jsonapi.parseInput(FEED_TYPE),
  controller.update(),
  jsonapi.generateOutput(FEED_TYPE),
);

feedRouter.delete(
  '/:feedId', //
  jsonapi.parseInput(),
  controller.remove(),
  jsonapi.generateOutput(FEED_TYPE),
);

export {
  feedRouter,
};
