/* eslint prefer-rest-params:0 */
import _ from 'lodash';

async function setCache(key, data, cacheProvider, ttl) {
  if (ttl) {
    await cacheProvider.set(key, data, ttl);
  } else {
    await cacheProvider.set(key, data);
  }
}

/**
 * Method for saving new data in cache and updating dependency keys for invalidation keys
 * @param cacheKey id of recorder element in cache
 * @param invalidationKeys array of invalidation keys for written element in cache
 * @param cacheProvider cache provider, it must have methods: get, set and del
 * @param ttl time to live (optional), will be provided as a third param to the cacheProvider set function
 * @returns {Promise.<*>}
 */
async function updateInvalidationKeys(cacheKey, invalidationKeys, cacheProvider, ttl) {
  for (let i = 0; i < invalidationKeys.length; i++) {
    const invalidationKey = invalidationKeys[i];
    const dependencyKeys = await cacheProvider.get(invalidationKey);
    let currentInvalidationKeysValues: Promise<void>[] = [];

    if (!_.isNil(dependencyKeys)) {
      if (dependencyKeys.indexOf(cacheKey) === -1) {
        dependencyKeys.push(cacheKey);
        currentInvalidationKeysValues = dependencyKeys;
      } else {
        currentInvalidationKeysValues = dependencyKeys;
      }
    } else {
      currentInvalidationKeysValues.push(cacheKey);
    }

    await setCache(invalidationKey, currentInvalidationKeysValues, cacheProvider, ttl);
  }
}

/**
 * Decorator for method which uses cache. This decorator is for method which uses promises
 * For using this decorator you need to call it above the method on which you want to use decorator.
 * Example of usage:
 *        @cacheDecorator((id) => `${constants.DEVELOPER_USER_ID}:${id}`,
 *        (userId) => [`${constants.DEVELOPER_INVALIDATION_KEY}:${userId}`,
 *        `${constants.APPLICATION_INVALIDATION_KEY}:${userId}`])
 * @param cacheKeyGenerator Function for generating key for entry in cache
 * @param cacheInvalidationKeyGenerator function which returns array of invalidation keys
 * @param cacheProvider cache provider, it must have methods: get, set and del
 * @param ttl time to live (optional), will be provided as a third param to the cacheProvider set function
 * @returns {Function} Function for handling communication with cache
 */
function cache(cacheKeyGenerator, cacheInvalidationKeyGenerator, cacheProvider, ttl?: number) {
  return function(target, name, descriptor) {
    const fetcher = descriptor.value;
    const getFromCache = async function() {
      const keyGeneratorArgs = Array.from(arguments);
      const cacheKey = cacheKeyGenerator.apply(null, keyGeneratorArgs);
      const scopeArguments = arguments;
      const fetcherClass = this;

      const result = await cacheProvider.get(cacheKey);
      if (!_.isNil(result)) {
        return result;
      }

      const databaseData = await fetcher.apply(fetcherClass, scopeArguments);
      setCache(cacheKey, databaseData, cacheProvider, ttl);

      if (_.isFunction(cacheInvalidationKeyGenerator)) {
        const invalidationKeys = cacheInvalidationKeyGenerator.apply(null, keyGeneratorArgs);
        await updateInvalidationKeys(cacheKey, invalidationKeys, cacheProvider, ttl);
      }

      return databaseData;
    };

    descriptor.value = getFromCache;

    return descriptor;
  };
}

async function invalidateKey(invalidationKey, cacheProvider) {
  const dependencyKeys = await cacheProvider.get(invalidationKey);
  if (!_.isNil(dependencyKeys)) {
    const dependencyKeyPromises: Promise<void>[] = [];
    for (let j = 0; j < dependencyKeys.length; j++) {
      const dependencyKey = dependencyKeys[j];
      dependencyKeyPromises.push(cacheProvider.del(dependencyKey));
    }

    await Promise.all(dependencyKeyPromises);
    await cacheProvider.del(invalidationKey);
  }
}

/**
 * Decorator for cache invalidation. This decorator is for method which uses promises
 * For using this decorator you need to call it above the method on which you want to use decorator.
 * Example of usage:
 *        @invalidateCache((userId) => [`${constants.DEVELOPER_INVALIDATION_KEY}:${userId}`,
 *        `${constants.APPLICATION_INVALIDATION_KEY}:${userId}`])
 * @param cacheInvalidationKeyGenerator function which returns array of invalidation keys
 * @param cacheProvider cache provider, it must have methods: get, set and del
 * @returns {Function} Function for cache invalidation
 */
function invalidateCache(cacheInvalidationKeyGenerator, cacheProvider) {
  return function(target, name, descriptor) {
    const databaseOperation = descriptor.value;
    const cacheInvalidation = async function() {
      const fetcherClass = this;
      const keyGeneratorArgs = Array.from(arguments);
      const invalidationKeys = cacheInvalidationKeyGenerator.apply(null, keyGeneratorArgs);
      const scopeArguments = arguments;

      const invalidationPromises: Promise<void>[] = [];
      for (let i = 0; i < invalidationKeys.length; i++) {
        const invalidationKey = invalidationKeys[i];
        invalidationPromises.push(invalidateKey(invalidationKey, cacheProvider));
      }
      await Promise.all(invalidationPromises);

      return databaseOperation.apply(fetcherClass, scopeArguments);
    };

    descriptor.value = cacheInvalidation;

    return descriptor;
  };
}

export { cache, invalidateCache };
