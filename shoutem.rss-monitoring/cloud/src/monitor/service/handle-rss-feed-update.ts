import RssParser from 'rss-parser';
import feedRepository from '../../feed/data/feed-repository';
import md5 from 'md5';
import _ from 'lodash';
import { logger } from '../../shared/logging';
import { createNotification } from '../providers/legacy-push-api';
import { invalidateLegacyFeed } from '../providers/legacy-feed-api';
import Monitor from '../data/monitor-model';

export const MAX_TITLE_LENGTH = 100;
export const MAX_SUMMARY_LENGTH = 140;

function getLastFeedItem(feed: RssParser.Output): RssParser.Item | null {
  if (feed && feed.items && feed.items.length > 0) {
    return feed.items[0];
  }
  return null;
}

async function fetchFeed(feedURL: string): Promise<RssParser.Output> {
  const rssParser = new RssParser();
  return rssParser.parseURL(feedURL);
}

function generateFeedItemHash(item: RssParser.Item): string {
  //  All elements of an item are optional, however at least one of title or description must be present
  return md5(`${item.title}${item.description}`);
}

function getFeedItemId(feed: RssParser.Item): string {
  return _.toString(feed.guid) || _.toString(feed.id);
}

function isFeedUpdated(feed: RssParser.Output, savedLastFeedItemHash = ''): boolean {
  const lastFeedItem = getLastFeedItem(feed);
  // generate a unique "hash" of the most recent entry
  if (lastFeedItem) {
    const lastFeedItemHash = generateFeedItemHash(lastFeedItem);
    return lastFeedItemHash !== savedLastFeedItemHash;
  }
  return false;
}

async function checkForRssFeedUpdate(
  monitor: Monitor,
  shortcuts: { key: string; feedUrl: string; feedType: string }[],
): Promise<any> {
  const promises = shortcuts.map(async shortcut => {
    const savedFeed = await feedRepository.findOne({ monitorId: monitor.id, feedKey: shortcut.key });
    let fetchedFeed;
    try {
      fetchedFeed = await fetchFeed(shortcut.feedUrl);
    } catch (e) {
      logger.error(`Unable to fetch feed with URL: ${shortcut.feedUrl}. ${e}`);
      return;
    }

    if (savedFeed) {
      // check latest
      if (isFeedUpdated(fetchedFeed, savedFeed.lastFeedItemHash)) {
        logger.info(`Feed ${shortcut.key} has changed.`);
        await invalidateLegacyFeed(monitor.appId, shortcut.feedUrl);
        logger.info(`Legacy feed invalidated.`);
        const lastFeedItem = getLastFeedItem(fetchedFeed);
        await feedRepository.update(savedFeed.id, {
          lastFeedItemHash: lastFeedItem ? generateFeedItemHash(lastFeedItem) : null,
        });

        const title = (() => {
          if (!lastFeedItem) {
            return null;
          }

          if (!lastFeedItem.title) {
            return null;
          }

          return lastFeedItem.title.substring(0, MAX_TITLE_LENGTH);
        })();

        const summary = (() => {
          if (!lastFeedItem) {
            return null;
          }

          if (lastFeedItem.description) {
            return lastFeedItem.description.substring(0, MAX_SUMMARY_LENGTH);
          }

          if (lastFeedItem.title) {
            return lastFeedItem.title.substring(0, MAX_SUMMARY_LENGTH);
          }

          return null;
        })();

        try {
          logger.info('Create push notification.');
          await createNotification(
            monitor.appId,
            savedFeed.feedKey || '',
            lastFeedItem ? getFeedItemId(lastFeedItem) : '',
            shortcut.feedType || '',
            title,
            summary,
          );
        } catch (e) {
          logger.error(`Unable to send push notification for app: ${monitor.appId}. ${e}`);
          return;
        }
      } else {
        logger.info(`Feed ${shortcut.key} has not changed.`);
      }
    } else {
      logger.info(`Feed ${shortcut.key} is first time observed.`);
      const lastFeedItem = getLastFeedItem(fetchedFeed);
      await feedRepository.create({
        feedKey: shortcut.key,
        lastFeedItemHash: lastFeedItem ? generateFeedItemHash(lastFeedItem) : null,
        monitorId: monitor.id,
      });
    }
  });
  await Promise.all(promises);
}

export async function handleRssFeedUpdate(
  monitoredShortcuts: { monitor: Monitor; shortcuts: { key: string; feedUrl: string; feedType: string }[] }[],
) {
  const promises = monitoredShortcuts.map(async monitoredShortcut => {
    if (monitoredShortcut.shortcuts && monitoredShortcut.shortcuts.length > 0) {
      await checkForRssFeedUpdate(monitoredShortcut.monitor, monitoredShortcut.shortcuts);
    }
  });
  await Promise.all(promises);
}
