import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/{=moduleName=}-controller';
import { load{=modelName.pascalCase=}Param } from '../middleware';
import { {=modelName.constantCase=}_TYPE } from '../io/types';

const {=modelName.camelCase=}Router: Router = express.Router();

/**
 * @swagger
 * parameters:
 *   {=modelName.camelCase=}Id:
 *     name: {=modelName.camelCase=}Id
 *     in: path
 *     description: {=modelName.camelCase=} identifier
 *     required: true
 *     type: string
 */
{=modelName.camelCase=}Router.param('{=modelName.camelCase=}Id', load{=modelName.pascalCase=}Param());

/**
 * @swagger
 * /v1/{=modelName.paramCasePlural=}/all:
 *   get:
 *     summary: Returns all {=modelName.noCasePlural=}
 *     tags:
 *     - {=modelName.titleCase=}
 *     responses:
 *       '200':
 *         description: {=modelName.noCase=} array
 *         schema:
 *           $ref: '#/components/schemas/{=modelName.pascalCase=}CollectionJsonApiDocument'
 */
{=modelName.camelCase=}Router.get(
  '/all', //
  jsonapi.parseInput(),
  controller.getAll(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

/**
 * @swagger
 * /v1/{=modelName.paramCasePlural=}:
 *   get:
 *     summary: Returns {=modelName.noCasePlural=} according to provided sort, filter and page options
 *     tags:
 *     - {=modelName.titleCase=}
 *     responses:
 *       '200':
 *         description: {=modelName.noCase=} array
 *         schema:
 *           $ref: '#/components/schemas/{=modelName.pascalCase=}CollectionJsonApiDocument'
 */
{=modelName.camelCase=}Router.get(
  '/', //
  jsonapi.parseInput(),
  controller.find(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

/**
 * @swagger
 * /v1/{=modelName.paramCasePlural=}/{{=modelName.camelCase=}Id}:
 *   get:
 *     summary: Returns {=modelName.noCase=} for given id
 *     tags:
 *     - {=modelName.titleCase=}
 *     parameters:
 *     - $ref: '#/parameters/{=modelName.camelCase=}Id'
 *     responses:
 *       '200':
 *         description: {=modelName.noCase=} object
 *         schema:
 *           $ref: '#/components/schemas/{=modelName.pascalCase=}JsonApiDocument'
 */
{=modelName.camelCase=}Router.get(
  '/:{=modelName.camelCase=}Id', //
  jsonapi.parseInput(),
  controller.get(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

/**
 * @swagger
 * /v1/{=modelName.paramCasePlural=}:
 *   post:
 *     tags:
 *     - {=modelName.titleCase=}
 *     summary: Creates new {=modelName.noCase=}
 *     parameters:
 *     - name: {=modelName.camelCase=}Data
 *       in: body
 *       schema:
 *         $ref: '#/components/schemas/{=modelName.pascalCase=}JsonApiDocument'
 *     responses:
 *       '201':
 *         description: created {=modelName.noCase=} object
 *         schema:
 *           $ref: '#/components/schemas/{=modelName.pascalCase=}JsonApiDocument'
 */
{=modelName.camelCase=}Router.post(
  '/', //
  jsonapi.parseInput({=modelName.constantCase=}_TYPE),
  controller.create(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

/**
 * @swagger
 * /v1/{=modelName.paramCasePlural=}/{{=modelName.camelCase=}Id}:
 *   patch:
 *     tags:
 *     - {=modelName.titleCase=}
 *     summary: Updates {=modelName.noCase=}
 *     parameters:
 *     - $ref: '#/parameters/{=modelName.camelCase=}Id'
 *     - name: {=modelName.camelCase=}Data
 *       in: body
 *       schema:
 *         $ref: '#/components/schemas/{=modelName.pascalCase=}JsonApiDocument'
 *     responses:
 *       '200':
 *         description: updated {=modelName.noCase=} object
 *         schema:
 *           $ref: '#/components/schemas/{=modelName.pascalCase=}JsonApiDocument'
 */
{=modelName.camelCase=}Router.patch(
  '/:{=modelName.camelCase=}Id', //
  jsonapi.parseInput({=modelName.constantCase=}_TYPE),
  controller.update(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

/**
 * @swagger
 * /v1/{=modelName.paramCasePlural=}/{{=modelName.camelCase=}Id}:
 *   delete:
 *     tags:
 *     - {=modelName.titleCase=}
 *     summary: Deletes {=modelName.noCase=}
 *     parameters:
 *     - $ref: '#/parameters/{=modelName.camelCase=}Id'
 *     responses:
 *       '204':
 *         description: no content
 */
{=modelName.camelCase=}Router.delete(
  '/:{=modelName.camelCase=}Id', //
  jsonapi.parseInput(),
  controller.remove(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

export {
  {=modelName.camelCase=}Router,
};
