import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import controller from '../controllers/settings-controller';
import '../io';
import { SETTINGS_TYPE } from '../io/types';
import { loadSettingsParam } from '../middleware';

// eslint-disable-next-line new-cap
const settingsRouter: Router = express.Router();

/**
 * @swagger
 * parameters:
 *   settingsId:
 *     name: settingsId
 *     in: path
 *     description: settings identifier
 *     required: true
 *     type: string
 */
settingsRouter.param('settingsId', loadSettingsParam());

/**
 * @swagger
 * /v1/settings:
 *   get:
 *     summary: Returns settings according to provided sort, filter and page options
 *     tags:
 *     - Settings
 *     responses:
 *       '200':
 *         description: settings array
 *         schema:
 *           $ref: '#/components/schemas/SettingsCollectionJsonApiDocument'
 */
settingsRouter.get('/', jsonapi.parseInput(), controller.get(), jsonapi.generateOutput(SETTINGS_TYPE));

/**
 * @swagger
 * /v1/settings:
 *   post:
 *     tags:
 *     - Settings
 *     summary: Creates new settings
 *     parameters:
 *     - name: settingsData
 *       in: body
 *       schema:
 *         $ref: '#/components/schemas/SettingsJsonApiDocument'
 *     responses:
 *       '201':
 *         description: created settings object
 *         schema:
 *           $ref: '#/components/schemas/SettingsJsonApiDocument'
 */
settingsRouter.post('/', jsonapi.parseInput(SETTINGS_TYPE), controller.create(), jsonapi.generateOutput(SETTINGS_TYPE));

/**
 * @swagger
 * /v1/settings/{settingsId}:
 *   patch:
 *     tags:
 *     - Settings
 *     summary: Updates settings
 *     parameters:
 *     - $ref: '#/parameters/settingsId'
 *     - name: settingsData
 *       in: body
 *       schema:
 *         $ref: '#/components/schemas/SettingsJsonApiDocument'
 *     responses:
 *       '200':
 *         description: updated settings object
 *         schema:
 *           $ref: '#/components/schemas/SettingsJsonApiDocument'
 */
settingsRouter.patch(
  '/:settingsId',
  jsonapi.parseInput(SETTINGS_TYPE),
  controller.update(),
  jsonapi.generateOutput(SETTINGS_TYPE),
);

export { settingsRouter };
