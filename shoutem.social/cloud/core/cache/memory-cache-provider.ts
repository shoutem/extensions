import _ from 'lodash';
import { CacheProvider } from './cache-provider';

let cacheStorage = {};
const cacheProvider: CacheProvider = {
  async getAsync(key) {
    return _.get(cacheStorage, key);
  },
  async setAsync(key, value) {
    _.set(cacheStorage, key, value);
  },
  async delAsync(key) {
    delete cacheStorage[key];
  },
  async flushAllAsync() {
    cacheStorage = {};
  },
  isAvailable: () => true,
};

export default cacheProvider;
