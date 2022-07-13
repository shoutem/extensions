import { map } from 'bluebird';
import { logger } from '../../shared/logging';
import { requireEnvNumber } from '../../../core/env';
import monitorRepository from '../data/monitor-repository';
import { getMonitoredShortcuts } from './get-monitored-shortcuts';
import { handleRssFeedUpdate } from './handle-rss-feed-update';

const CONCURRENCY = requireEnvNumber('MONITOR_JOB_CONCURENNCY', 10);

async function runMonitor(monitor) {
  const monitoredShortcuts = await getMonitoredShortcuts(monitor);
  await handleRssFeedUpdate(monitor, monitoredShortcuts);
}

export default async function processMonitoringJob() {
  const monitors = await monitorRepository.getAll();
  logger.info(`Total count of monitors: ${monitors.length}.`);

  map(monitors, runMonitor, { concurrency: CONCURRENCY });
}
