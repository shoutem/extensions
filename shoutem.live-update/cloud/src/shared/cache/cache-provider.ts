export interface CacheProvider {
  get(key): Promise<object | null>;

  set(key, value, ttl): Promise<void>;

  del(key): Promise<void>;
}
