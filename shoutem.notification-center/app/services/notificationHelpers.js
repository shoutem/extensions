import _ from 'lodash';
import { GROUP_PREFIX } from '../const';

export function viewNotification(notification) {
  return notification.action;
}

export const getNextActionParams = action => ({
  ..._.get(action, 'meta.params'),
});

export const getNextActionLinks = action => ({
  next: _.get(action, 'payload.paging.next'),
});

export const hasNextPage = payload => !!_.get(payload, 'paging.next');

export const resolveNotification = notification => {
  const {
    imageUrl,
    audience: { type, groups },
  } = notification;
  const isSingleGroupNotification = type === 'group' && groups.length === 1;

  if (isSingleGroupNotification) {
    notification.imageUrl = _.get(groups, ['0', 'imageUrl'], imageUrl);
  }

  return notification;
};

/**
 * Returns true if a group should be subscribed to by default but isn't,
 * and the user didn't manually unsubscribe.
 */
export const shouldSubscribeToGroupByDefault = (
  group,
  selectedGroups,
  manuallyUnsubscribedGroups,
) => {
  const { subscribeByDefault, tag } = group;
  const prefixedTag = `${GROUP_PREFIX + tag}`;

  if (!subscribeByDefault) {
    return false;
  }

  const isSubscribed = _.includes(selectedGroups, prefixedTag);
  const isManuallyUnsubscribed = _.includes(
    manuallyUnsubscribedGroups,
    prefixedTag,
  );

  return !isSubscribed && !isManuallyUnsubscribed;
};
