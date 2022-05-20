import _ from 'lodash';
import { getShortcuts } from '../providers/application-manager';
import monitorRepository from '../../monitor/data/monitor-repository';
import Monitor from '../data/monitor-model';
import { logger } from '../../shared/logging';

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

export async function getMonitoredShortcuts(page: {
  offset: number;
  limit: number;
}): Promise<{ monitor: Monitor; shortcuts: { key: string; feedUrl: string; feedType: string }[] }[]> {
  const monitorsPage = await monitorRepository.findPage({}, ['id'], page);
  const monitors = monitorsPage.getPageItems();

  // for each app find monitored shortcout
  const promises = monitors.map(async monitor => {
    let shortcutsResponse;
    try {
      shortcutsResponse = await getShortcuts(monitor.appId);
    } catch (e) {
      logger.error(`Unable to fetch shortcuts for app: ${monitor.appId}. ${e}`);
    }

    return {
      monitor,
      shortcuts: findMonitoredShortcuts(shortcutsResponse),
    };
  });

  return Promise.all(promises);
}
