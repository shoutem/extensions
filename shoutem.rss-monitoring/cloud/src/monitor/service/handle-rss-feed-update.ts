import { logger } from '../../shared/logging';
import feedRepository from '../../feed/data/feed-repository';
import { createNotification } from '../providers/legacy-push-api';
import { getLastFeedItem } from '../providers/proxy-manager';
import Monitor from '../data/monitor-model';

export const MAX_TITLE_LENGTH = 100;
export const MAX_SUMMARY_LENGTH = 140;

function resolveFeedItemTitle(lastFeedItem) {
  if (!lastFeedItem) {
    return null;
  }

  if (!lastFeedItem.title) {
    return null;
  }

  return lastFeedItem.title.substring(0, MAX_TITLE_LENGTH);
}

function resolveFeedItemSummary(lastFeedItem) {
  if (!lastFeedItem) {
    return null;
  }

  if (lastFeedItem.summary) {
    return lastFeedItem.summary.substring(0, MAX_SUMMARY_LENGTH);
  }

  if (lastFeedItem.title) {
    return lastFeedItem.title.substring(0, MAX_SUMMARY_LENGTH);
  }

  return null;
}

async function checkForRssFeedUpdate(
  monitor: Monitor,
  shortcuts: { key: string; feedUrl: string; feedType: string }[],
): Promise<any> {
  const promises = shortcuts.map(async shortcut => {
    const savedFeed = await feedRepository.findOne({ monitorId: monitor.id, feedKey: shortcut.key });
    let lastFeedItem;

    try {
      lastFeedItem = await getLastFeedItem(monitor.appId, shortcut.feedType, shortcut.feedUrl);
    } catch (e) {
      logger.error(`Unable to fetch last feed with URL: ${shortcut.feedUrl}. ${e}`);
      return;
    }

    if (!lastFeedItem) {
      logger.error(`Last feed item not fetched: ${shortcut.feedUrl}.`);
      return;
    }

    if (savedFeed) {
      // check latest
      if (lastFeedItem.id !== savedFeed.lastFeedItemHash) {
        logger.info(`Feed ${shortcut.key} has changed.`);
        await feedRepository.update(savedFeed.id, {
          lastFeedItemHash: lastFeedItem.id,
        });

        const title = resolveFeedItemTitle(lastFeedItem);
        const summary = resolveFeedItemSummary(lastFeedItem);

        try {
          logger.info('Create push notification.');
          await createNotification(
            monitor.appId,
            savedFeed.feedKey || '',
            lastFeedItem.id,
            shortcut.feedType || '',
            title,
            summary,
          );
        } catch (e) {
          logger.error(`Unable to send push notification for app: ${monitor.appId}. ${e}`);
        }
      } else {
        logger.info(`Feed ${shortcut.key} has not changed.`);
      }
    } else {
      logger.info(`Feed ${shortcut.key} is first time observed.`);

      await feedRepository.create({
        feedKey: shortcut.key,
        lastFeedItemHash: lastFeedItem.id,
        monitorId: monitor.id,
      });
    }
  });
  await Promise.all(promises);
}

export async function handleRssFeedUpdate(
  monitor: Monitor,
  shortcuts: { key: string; feedUrl: string; feedType: string }[],
) {
  if (shortcuts && shortcuts.length > 0) {
    await checkForRssFeedUpdate(monitor, shortcuts);
  }
}

export async function handleRssFeedUpdateForApp(
  appId: string,
  shortcuts: { key: string; feedUrl: string; feedType: string }[],
) {
  logger.info(`Rss feed update for app:${appId}.`);

  if (shortcuts && shortcuts.length > 0) {
    logger.info(`Shortcuts found:${shortcuts.length}.`);

    const promises = shortcuts.map(async shortcut => {
      const lastFeedItem = await getLastFeedItem(appId, shortcut.feedType, shortcut.feedUrl);
      if (!lastFeedItem) {
        return;
      }

      const title = resolveFeedItemTitle(lastFeedItem);
      const summary = resolveFeedItemSummary(lastFeedItem);

      logger.info(`Creating notification for app:${appId} and feedUrl ${shortcut.feedUrl}.`);

      await createNotification(appId, shortcut.key || '', lastFeedItem.id, shortcut.feedType || '', title, summary);
    });

    await Promise.all(promises);
  }
}
