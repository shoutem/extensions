import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import controller from '../controllers/settings-controller';
import '../io';
import { SETTINGS_TYPE } from '../io/types';
import { loadSettingsParam } from '../middleware';

const settingsRouter: Router = express.Router();

settingsRouter.param('settingsId', loadSettingsParam());

settingsRouter.get(
  '/',
  jsonapi.parseInput(),
  controller.get(),
  jsonapi.generateOutput(SETTINGS_TYPE),
);

settingsRouter.post(
  '/',
  jsonapi.parseInput(SETTINGS_TYPE),
  controller.create(),
  jsonapi.generateOutput(SETTINGS_TYPE),
);

settingsRouter.patch(
  '/:settingsId',
  jsonapi.parseInput(SETTINGS_TYPE),
  controller.update(),
  jsonapi.generateOutput(SETTINGS_TYPE),
);

export {
  settingsRouter,
};
