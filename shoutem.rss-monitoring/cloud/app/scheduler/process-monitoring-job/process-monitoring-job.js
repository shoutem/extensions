import 'dotenv/config';
import '../../../src/sequelize/models';
import database from '../../../src/shared/db/database';
import { logger } from '../../../src/shared/logging';
import processMonitoringJob from '../../../src/monitor/service/monitoring-job';

logger.level('info');

database
  .connect()
  .then(async () => {
    await processMonitoringJob();
  })
  .catch(e => logger.error(e));
