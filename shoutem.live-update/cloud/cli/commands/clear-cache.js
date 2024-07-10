import { logger } from '../../src/shared/logging';

export async function handler() {
  return clearCache();
}

async function clearCache() {
  try {
    const redisCacheProvider = require('../../src/shared/redis/redis-client').default;

    await redisCacheProvider.flushAllAsync();
    logger.info('All keys flushed from the redis store.');
    process.exit();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}
