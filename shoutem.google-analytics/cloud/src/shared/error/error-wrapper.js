/* eslint no-console:0 */
import Promise from 'bluebird';
import { logger } from '../logging';
/**
  Comment out if you want to use Sentry error logging
 */
// import Raven from '../sentry';

/**
 * Suppresses and logs error
 * @returns {Promise.<Object>} Promise result
 */
export async function suppressAndLogError(fn) {
  try {
    return await Promise.resolve(fn());
  } catch (err) {
    logger.error(err);
    try {
      // await Raven.captureExceptionAsync(err);
    } catch (err) {
      logger.error(err, 'Error reporting failed');
    }
    return err;
  }
}
