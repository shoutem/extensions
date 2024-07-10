import _ from 'lodash';
import App from './app-model';
import { lean } from '../../shared/db';
import { CrudSequelizeRepository } from '../../shared/repository';
import { cache, invalidateCache } from '../../shared/cache';

import { cacheProvider } from '../../cache';

function getByAppIdKey(appId) {
  return `apps/${appId}`;
}

function invalidationKeys(app) {
  return [getByAppIdKey(app.appId)];
}

export class AppRepository extends CrudSequelizeRepository<App> {
  constructor() {
    super(App);
  }

  @cache(getByAppIdKey, null, cacheProvider)
  @lean
  async getByAppId(appId): Promise<App> {
    const app = await this.findOne({ appId });
    return app;
  }

  @invalidateCache(invalidationKeys, cacheProvider)
  async update(app, data) {
    const appUpdated = await super.update(app.id, data);
    return appUpdated;
  }
}

export default new AppRepository();
