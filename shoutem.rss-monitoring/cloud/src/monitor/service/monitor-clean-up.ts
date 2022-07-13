import _ from 'lodash';
import { logger } from '../../shared/logging';
import monitorRepository from '../../monitor/data/monitor-repository';
import { getAppSubscriptionStatus } from '../providers/app-manager';
import Monitor from '../data/monitor-model';

export async function cleanUpMonitor(monitor: Monitor): Promise<any> {
  const appSubscriptionStatus = await getAppSubscriptionStatus(monitor.appId);

  // if app subscription status is null then app is deleted (not found)
  if (!appSubscriptionStatus) {
    await monitorRepository.remove(monitor.id);
    logger.info(`Removed monitor: ${monitor.id} for app: ${monitor.appId}. App is deleted.`);

    return;
  }

  const valid = _.get(appSubscriptionStatus, 'data.attributes.valid');
  // if subscription is not valid
  if (!valid) {
    await monitorRepository.remove(monitor.id);
    logger.info(`Removed monitor: ${monitor.id} for app: ${monitor.appId}. Subscription not valid.`);
  }
}
