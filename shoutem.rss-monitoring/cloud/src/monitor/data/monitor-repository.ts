import Monitor from './monitor-model';
import { CrudSequelizeRepository } from '../../shared/repository';

export class MonitorRepository extends CrudSequelizeRepository<Monitor> {
  constructor() {
    super(Monitor);
  }
}

export default new MonitorRepository();
