import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import {=modelName.camelCase=}Repository from '../data/{=modelName.paramCase=}-repository';
import { get{=modelName.pascalCase=} } from '../service';

export class {=modelName.pascalCase=}Controller {
  create() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const data = _.pick(io.get(req), [{=#properties=}
        '{=name=}',{=/properties=}
      ]);

      const {=modelName.camelCase=} = await {=modelName.camelCase=}Repository.create(data);
      io.setCreated(res, {=modelName.camelCase=});
    });
  }

  update() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const {=modelName.camelCase=} = get{=modelName.pascalCase=}(req);

      const changes = _.pick(io.get(req), [{=#properties=}
        '{=name=}',{=/properties=}
      ]);

      const {=modelName.camelCase=}Updated = await {=modelName.camelCase=}Repository.update({=modelName.camelCase=}.id, changes);
      io.set(res, {=modelName.camelCase=}Updated);
    });
  }

  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const {=modelName.camelCase=} = get{=modelName.pascalCase=}(req);
      io.set(res, {=modelName.camelCase=});
    });
  }

  getAll() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const {=modelName.camelCase=}s = await {=modelName.camelCase=}Repository.getAll();
      io.set(res, {=modelName.camelCase=}s);
    });
  }

  find() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const filter = io.getFilter(req);
      const pageOptions = io.getPageOrDefault(req);
      const sortOptions = io.getSort(req);

      const {=modelName.camelCase=}s = await {=modelName.camelCase=}Repository.findPage(filter, sortOptions, pageOptions);

      io.set(res, {=modelName.camelCase=}s.getPageItems());
      io.setPage(res, {=modelName.camelCase=}s.getPageInfo());
    });
  }

  remove() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const {=modelName.camelCase=} = get{=modelName.pascalCase=}(req);
      await {=modelName.camelCase=}Repository.remove({=modelName.camelCase=}.id);
      io.setEmpty(res);
    });
  }
}

export default new {=modelName.pascalCase=}Controller();
