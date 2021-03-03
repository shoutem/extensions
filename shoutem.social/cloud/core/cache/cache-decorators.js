/* eslint prefer-rest-params:0 prefer-spread:0 */
import _ from 'lodash';
import bluebird from 'bluebird';

/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * Method for saving new data in cache and updating dependency keys for invalidation keys
 * @param cacheKey id of recorder element in cache
 * @param invalidationKeys array of invalidation keys for written element in cache
 * @param cacheProvider promisified cache, it must have methods: getAsync, setAsync and delAsync
 * @returns {Promise.<*>}
 */
async function updateInvalidationKeys(cacheKey, invalidationKeys, cacheProvider) {
  await bluebird.each(invalidationKeys, async (invalidationKey) => {
    const dependencyKeys = await cacheProvider.getAsync(invalidationKey);
    let currentInvalidationKeysValues = [];

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

    await cacheProvider.setAsync(invalidationKey, currentInvalidationKeysValues);
  });
}

/**
 * Decorator for method which uses cache. This decorator is for method which uses promises
 * For using this decorator you need to call it above the method on which you want to use decorator.
 * Example of usage:
 *        @cache((id) => `${constants.DEVELOPER_USER_ID}:${id}`,
 *        (userId) => [`${constants.DEVELOPER_INVALIDATION_KEY}:${userId}`,
 *        `${constants.APPLICATION_INVALIDATION_KEY}:${userId}`])
 * @param cacheKeyGenerator Function for generating key for entry in cache
 * @param cacheInvalidationKeyGenerator function which returns array of invalidation keys
 * @param cacheProvider promisified cache, it must have methods: getAsync, setAsync and delAsync
 * @returns {Function} Function for handling communication with cache
 */
function cache(cacheKeyGenerator, cacheInvalidationKeyGenerator, cacheProvider) {
  return function (target, name, descriptor) {
    const fetcher = descriptor.value;
    const getFromCache = async function () {
      const keyGeneratorArgs = Array.from(arguments);
      const cacheKey = cacheKeyGenerator.apply(null, keyGeneratorArgs);
      const invalidationKeys = cacheInvalidationKeyGenerator.apply(null, keyGeneratorArgs);
      const scopeArguments = arguments;
      const fetcherClass = this;
      const result = await cacheProvider.getAsync(cacheKey);

      if (!_.isNil(result)) {
        return result;
      }

      const databaseData = await fetcher.apply(fetcherClass, scopeArguments);
      if (databaseData) {
        await cacheProvider.setAsync(cacheKey, databaseData);
      }

      await updateInvalidationKeys(cacheKey, invalidationKeys, cacheProvider);

      return databaseData;
    };

    descriptor.value = getFromCache;

    return descriptor;
  };
}

/**
 * Decorator for cache invalidation. This decorator is for method which uses promises
 * For using this decorator you need to call it above the method on which you want to use decorator.
 * Example of usage:
 *        @invalidateCache((userId) => [`${constants.DEVELOPER_INVALIDATION_KEY}:${userId}`,
 *        `${constants.APPLICATION_INVALIDATION_KEY}:${userId}`])
 * @param cacheInvalidationKeyGenerator function which returns array of invalidation keys
 * @param cacheProvider promisified cache, it must have methods: getAsync, setAsync and delAsync
 * @returns {Function} Function for cache invalidation
 */
function invalidateCache(cacheInvalidationKeyGenerator, cacheProvider) {
  return function (target, name, descriptor) {
    const databaseOperation = descriptor.value;
    const cacheInvalidation = async function () {
      const fetcherClass = this;
      const keyGeneratorArgs = Array.from(arguments);
      const invalidationKeys = cacheInvalidationKeyGenerator.apply(null, keyGeneratorArgs);
      const scopeArguments = arguments;

      await bluebird.each(invalidationKeys, async (invalidationKey) => {
        const dependencyKeys = await cacheProvider.getAsync(invalidationKey);

        if (!_.isNil(dependencyKeys)) {
          await bluebird.each(dependencyKeys, async (dependencyKey) => {
            await cacheProvider.delAsync(dependencyKey);
          });

          await cacheProvider.delAsync(invalidationKey);
        }
      });

      return databaseOperation.apply(fetcherClass, scopeArguments);
    };

    descriptor.value = cacheInvalidation;

    return descriptor;
  };
}

export { cache, invalidateCache };
