import { sleep } from '../../shared/core';
import monitorRepository from '../data/monitor-repository'
import { getMonitoredShortcuts } from './get-monitored-shortcuts';
import { handleRssFeedUpdate } from './handle-rss-feed-update';

const LIMIT = 10;

export default async function processMonitoringJob() {
  const count = await monitorRepository.getCountAll();
  const countLimit = count + LIMIT;

  let offset = 0;
  while (countLimit >= offset) {
    const page = { offset, limit: LIMIT };

    const monitoredShortcuts = await getMonitoredShortcuts(page);
    await handleRssFeedUpdate(monitoredShortcuts);

    offset += LIMIT;

    // sleep for 3 seconds
    await sleep(3000);
  }
}
