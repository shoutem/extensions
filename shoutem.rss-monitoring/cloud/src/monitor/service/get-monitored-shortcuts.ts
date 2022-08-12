import _ from 'lodash';
import { logger } from '../../shared/logging';
import { getShortcuts } from '../providers/app-manager';
import Monitor from '../data/monitor-model';
import { cleanUpMonitor } from './monitor-clean-up';

function filterShortcutsByMonitoredProperty(shortcuts: [object]): { key: string; feedUrl: string; feedType: string }[] {
  const resolvedShortcuts: { key: string; feedUrl: string; feedType: string }[] = [];
  shortcuts.forEach(shortcut => {
    if (_.get(shortcut, 'attributes.settings.shoutemRssMonitoring.monitored')) {
      resolvedShortcuts.push({
        key: _.get(shortcut, 'attributes.key'),
        feedUrl: _.get(shortcut, 'attributes.settings.feedUrl'),
        feedType: _.get(shortcut, 'attributes.settings.feedType'),
      });
    }
  });
  return resolvedShortcuts;
}

function findMonitoredShortcuts(shortcutsResponse: any): { key: string; feedUrl: string; feedType: string }[] {
  // check in data and in included
  const monitoredShortcuts: { key: string; feedUrl: string; feedType: string }[] = [];

  if (shortcutsResponse && shortcutsResponse.data) {
    monitoredShortcuts.push(...filterShortcutsByMonitoredProperty(shortcutsResponse.data));
  }
  if (shortcutsResponse && shortcutsResponse.included) {
    monitoredShortcuts.push(...filterShortcutsByMonitoredProperty(shortcutsResponse.included));
  }

  return monitoredShortcuts;
}

export async function getMonitoredShortcuts(
  monitor: Monitor,
): Promise<{ key: string; feedUrl: string; feedType: string }[]> {
  let shortcutsResponse;

  try {
    shortcutsResponse = await getShortcuts(monitor.appId);
  } catch (e) {
    logger.error(`Unable to fetch shortcuts for app: ${monitor.appId}. ${e}`);

    try {
      await cleanUpMonitor(monitor);
    } catch (error) {
      logger.error(`Unable to clean up monitor for app: ${monitor.appId}. ${e}`);
    }
  }

  return findMonitoredShortcuts(shortcutsResponse);
}

export async function getMonitoredShortcutsByApp(appId: string) {
  const shortcutsResponse = await getShortcuts(appId);
  return findMonitoredShortcuts(shortcutsResponse);
}
