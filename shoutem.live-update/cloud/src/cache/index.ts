import { memoryCacheProvider, redisCacheProvider } from '../shared/cache';

let cacheProvider: any = memoryCacheProvider;

if (process.env.REDIS_CACHE_URL) {
  cacheProvider = redisCacheProvider;
}

export { cacheProvider };
