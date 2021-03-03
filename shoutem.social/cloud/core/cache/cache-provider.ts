export interface CacheProvider {
  getAsync(key): object;

  setAsync(key, value): Promise<void>;

  delAsync(key): Promise<void>;

  flushAllAsync(): Promise<void>;

  isAvailable(): boolean;
}
