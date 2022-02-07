import redis from 'redis';
import events from 'events';
import util from 'util';
import { logger } from '../logging';
import { CacheProvider } from '../../../core/cache/cache-provider';

const INFO_CHANNEL = 'info-channel';
const FLUSHING_STARTED = 'flushing-started';
const FLUSHING_COMPLETED = 'flushing-completed';

let isConnectionAvailable;
let isSubConnectionAvailable;
let isFlushing;

/* eslint-disable @typescript-eslint/camelcase */

// Redis client init
const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The redis server refused the connection');
    }
    // reconnect after 10s
    return 10000;
  },
});

redisClient.on('ready', () => {
  isConnectionAvailable = true;
  logger.info('Redis client is ready');
});

redisClient.on('end', () => {
  isConnectionAvailable = false;
  logger.error(new Error('Lost connection to redis'));
});

redisClient.on('connect', () => {
  isConnectionAvailable = true;
  logger.info('Established connection to redis');
});

redisClient.on('reconnecting', () => {
  logger.info('Attempting to establish connection to redis');
});

redisClient.on('error', (error) => {
  isConnectionAvailable = false;
  logger.error(error);
});

// Redis subscriber client init
const redisClientSub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The redis server refused the connection');
    }
    // reconnect after 10s
    return 10000;
  },
});

const eventEmiter = new events.EventEmitter();

eventEmiter.on(FLUSHING_STARTED, () => {
  logger.info('Flush started, disabling cache utilization.');
  isFlushing = true;
});
eventEmiter.on(FLUSHING_COMPLETED, () => {
  logger.info('Flush completed, enabling cache utilization.');
  isFlushing = false;
});

redisClientSub.subscribe(INFO_CHANNEL);

redisClientSub.on('message', (channel, message) => {
  const deserialized = JSON.parse(message);
  if (deserialized.type) {
    eventEmiter.emit(deserialized.type, deserialized);
  }
});

redisClientSub.on('ready', () => {
  isSubConnectionAvailable = true;
  logger.info('Redis sub client is ready');
});

redisClientSub.on('end', () => {
  isSubConnectionAvailable = false;
  logger.error(new Error('Sub client lost connection to redis'));
});

redisClientSub.on('connect', () => {
  logger.info('Sub client established connection to redis');
});

redisClientSub.on('reconnecting', () => {
  logger.info('Sub client attempting to establish connection to redis');
});

redisClientSub.on('error', (error) => {
  logger.error(error);
});

async function flushAll() {
  const flushingStartMessage = {
    type: FLUSHING_STARTED,
  };
  const flushingCompletedMessage = {
    type: FLUSHING_COMPLETED,
  };

  redisClient.publish(INFO_CHANNEL, JSON.stringify(flushingStartMessage));
  const flushAsync = util.promisify(redisClient.flushall).bind(redisClient);
  await flushAsync();
  redisClient.publish(INFO_CHANNEL, JSON.stringify(flushingCompletedMessage));
}

const redisCacheProvider: CacheProvider = {
  isAvailable: () => isConnectionAvailable && isSubConnectionAvailable && !isFlushing,
  getAsync: util.promisify(redisClient.get).bind(redisClient),
  setAsync: util.promisify(redisClient.set).bind(redisClient),
  delAsync: util.promisify(redisClient.del).bind(redisClient),
  flushAllAsync: flushAll,
};

export default redisCacheProvider;
