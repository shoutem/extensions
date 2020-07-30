import database from '../../../src/shared/db/database';
import { logger } from '../../../src/shared/logging';
import { getMonitoredShortcuts } from '../../../src/monitor/service/get-monitored-shortcuts';
import { handleRssFeedUpdate } from '../../../src/monitor/service/handle-rss-feed-update';
import '../../../src/sequelize/models';

logger.level('info');

database
  .connect()
  .then(async () => {
    const monitoredShortcuts = await getMonitoredShortcuts();
    await handleRssFeedUpdate(monitoredShortcuts);
  })
  .catch(e => logger.error(e));
