import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/{=moduleName=}-controller';
import { load{=modelName.pascalCase=}Param } from '../middleware';
import { {=modelName.constantCase=}_TYPE } from '../io/types';

const {=modelName.camelCase=}Router: Router = express.Router();

{=modelName.camelCase=}Router.param('{=modelName.camelCase=}Id', load{=modelName.pascalCase=}Param());

{=modelName.camelCase=}Router.get(
  '/all', //
  jsonapi.parseInput(),
  controller.getAll(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

{=modelName.camelCase=}Router.get(
  '/', //
  jsonapi.parseInput(),
  controller.find(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

{=modelName.camelCase=}Router.get(
  '/:{=modelName.camelCase=}Id', //
  jsonapi.parseInput(),
  controller.get(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

{=modelName.camelCase=}Router.post(
  '/', //
  jsonapi.parseInput({=modelName.constantCase=}_TYPE),
  controller.create(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

{=modelName.camelCase=}Router.patch(
  '/:{=modelName.camelCase=}Id', //
  jsonapi.parseInput({=modelName.constantCase=}_TYPE),
  controller.update(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

{=modelName.camelCase=}Router.delete(
  '/:{=modelName.camelCase=}Id', //
  jsonapi.parseInput(),
  controller.remove(),
  jsonapi.generateOutput({=modelName.constantCase=}_TYPE),
);

export {
  {=modelName.camelCase=}Router,
};
