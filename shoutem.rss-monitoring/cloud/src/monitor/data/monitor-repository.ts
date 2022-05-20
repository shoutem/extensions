import Monitor from './monitor-model';
import { CrudSequelizeRepository } from '../../shared/repository';

export class MonitorRepository extends CrudSequelizeRepository<Monitor> {
  constructor() {
    super(Monitor);
  }

  getCountAll() {
    return Monitor.count();
  }
}

export default new MonitorRepository();
