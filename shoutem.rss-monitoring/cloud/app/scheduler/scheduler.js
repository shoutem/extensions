/* eslint-disable */

import database from '../../src/shared/db/database';
import '../../src/sequelize/models';
import { logger } from '../../src/shared/logging';
import schedule from 'node-schedule';
import config from './config';
/**
 Comment out these imports to use scheduler app.
 Process example is here only for example purpose
 and to explain how scheduler task should be implemented.
 */
// import Raven from '../../src/shared/sentry';
// import { processExample } from '../../src/scheduler/task';

function asyncJobWrapper(name, task) {
  return async () => {
    logger.info(`'${name}' job started`);
    try {
      await task();
      logger.info(`'${name}' job finished successfully`);
    } catch (err) {
      logger.error(err, `'${name}' job failed`);
      try {
        // await Raven.captureExceptionAsync(err, { tags: { job: name } });
      } catch (err) {
        logger.error(err, 'Error reporting failed');
      }
    }
  };
}

database.connect().then(() => {
  // schedule.scheduleJob(config.rules.processExample, asyncJobWrapper('Example processing', processExample));  
  return asyncJobWrapper('Example processing', async () => { console.log('Monitoring feeds...'); })();
});

//Promise.resolve().then(() => {
  // schedule.scheduleJob(config.rules.processExample, asyncJobWrapper('Example processing', processExample));
//  return asyncJobWrapper('Example processing', async () => { console.log('Monitoring feeds...'); })();
//});

/* eslint-enable */
