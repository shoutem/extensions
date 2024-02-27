import _ from 'lodash';
import { lean } from '../../shared/db';
import { CrudSequelizeRepository } from '../../shared/repository';
import App from './app-model';

export class AppRepository extends CrudSequelizeRepository<App> {
  constructor() {
    super(App);
  }

  @lean
  async getByAppId(appId): Promise<App> {
    const app = await this.findOne({ appId });
    return app;
  }
}

export default new AppRepository();
