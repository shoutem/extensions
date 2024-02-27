import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import appRepository from '../data/app-repository';
import { getApp } from '../service';

export class AppController {
  update() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const app = getApp(req);

      const changes =
        _.pick(io.get(req), [
          'propertyId',
          'serviceAccountKeyJson',
        ]) || {};

      const appUpdated = await appRepository.update(app.id, changes);

      io.set(res, appUpdated);
    });
  }

  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const app = getApp(req);
      io.set(res, app);
    });
  }
}

export default new AppController();
