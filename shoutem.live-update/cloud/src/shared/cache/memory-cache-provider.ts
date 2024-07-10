import NodeCache from 'node-cache';
import { CacheProvider } from './cache-provider';
import config from './config';

class MemoryCacheProvider implements CacheProvider {
  constructor(private client: NodeCache) {
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.del = this.del.bind(this);
  }

  async get(key) {
    try {
      const result = (await this.client.get(key)) as string;
      return JSON.parse(result);
    } catch (error) {
      return null;
    }
  }

  async set(key, val, ttl) {
    const expiration = ttl || config.ttl;

    try {
      this.client.set(key, JSON.stringify(val), expiration);
    } catch (error) {
      // do nothing
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      // do nothing
    }
  }
}

export default new MemoryCacheProvider(new NodeCache({ stdTTL: config.ttl, checkperiod: 600 }));
