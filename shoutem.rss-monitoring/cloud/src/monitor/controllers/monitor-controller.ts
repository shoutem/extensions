import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import monitorRepository from '../data/monitor-repository';
import { getMonitor } from '../service';

export class MonitorController {
  create() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const data = _.pick(io.get(req), ['appId']);

      const monitor = await monitorRepository.create(data);
      io.setCreated(res, monitor);
    });
  }

  update() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const monitor = getMonitor(req);

      const changes = _.pick(io.get(req), ['appId']);

      const monitorUpdated = await monitorRepository.update(monitor.id, changes);
      io.set(res, monitorUpdated);
    });
  }

  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const monitor = getMonitor(req);
      io.set(res, monitor);
    });
  }

  getAll() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const monitors = await monitorRepository.getAll();
      io.set(res, monitors);
    });
  }

  find() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const filter = io.getFilter(req);
      const pageOptions = io.getPageOrDefault(req);
      const sortOptions = io.getSort(req);

      const monitors = await monitorRepository.findPage(filter, sortOptions, pageOptions);

      io.set(res, monitors.getPageItems());
      io.setPage(res, monitors.getPageInfo());
    });
  }

  remove() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const monitor = getMonitor(req);
      await monitorRepository.remove(monitor.id);
      io.setEmpty(res);
    });
  }
}

export default new MonitorController();
