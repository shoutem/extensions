import * as RNLocalize from 'react-native-localize';
import _ from 'lodash';
import moment from 'moment';
import {
  PUSH_NOTIFICATION_AUDIENCE_TYPES,
  PUSH_NOTIFICATION_GROUP_TYPES,
  PUSH_NOTIFICATION_TYPE_OPTIONS,
  PUSH_NOTIFICATIONS_TARGET_OPTIONS,
} from '../const';

const URL_PUSH_NOTIFICATION_ACTION = (title, url) =>
  JSON.stringify({
    action: {
      route: {
        key: `push-${new Date().getTime().toString()}`,
        screen: 'shoutem.web-view.WebViewScreen',
        props: {
          ...(url ? { url } : {}),
          title,
          showNavigationToolbar: true,
        },
      },
      type: 'shoutem.navigation.OPEN_MODAL',
    },
  });

const SHORTCUT_PUSH_NOTIFICATION_ACTION = shortcutId =>
  JSON.stringify({
    action: {
      type: 'shoutem.application.EXECUTE_SHORTCUT',
      navigationAction: 'shoutem.navigation.OPEN_MODAL',
      shortcutId,
    },
  });

const APP_PUSH_NOTIFICATION_ACTION = title =>
  JSON.stringify({
    action: {
      route: {
        key: `push-${new Date().getTime().toString()}`,
        props: {
          title,
        },
      },
    },
  });

export function formatNotificationGroupOptions(notificationGroups) {
  return [
    { name: 'All', audienceType: PUSH_NOTIFICATION_AUDIENCE_TYPES.BROADCAST },
    ..._.map(notificationGroups, group => ({
      name: group.name,
      audienceType: PUSH_NOTIFICATION_AUDIENCE_TYPES.GROUP,
    })),
  ];
}

export function formatGroupDisplayName(audience) {
  const { type } = audience;

  if (
    type === PUSH_NOTIFICATION_GROUP_TYPES.USER ||
    type === PUSH_NOTIFICATION_GROUP_TYPES.BROADCAST
  ) {
    return 'All';
  }

  if (type === PUSH_NOTIFICATION_GROUP_TYPES.GROUP) {
    const { groups } = audience;

    return _.join(_.map(groups, 'name'), ', ');
  }

  return '';
}

export function formatDeliveryTime(deliveryTime) {
  if (!deliveryTime) {
    return '';
  }

  const timeFormat = RNLocalize.uses24HourClock() ? 'H:mm' : 'hh:mm A';

  return moment(deliveryTime).format(`DD MMMM YYYY [at] ${timeFormat}`);
}

export function formatNotificationGroups(groups) {
  return _.map(groups, group =>
    _.pick(group, ['hidden', 'id', 'imageUrl', 'name', 'subscribeByDefault']),
  );
}

function mapTargetTypeToView(notification) {
  const targetType = _.get(notification, 'target.type', '');

  if (targetType === _.toLower(PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL)) {
    return PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL;
  }

  if (targetType === 'none') {
    return PUSH_NOTIFICATIONS_TARGET_OPTIONS.APP;
  }

  return PUSH_NOTIFICATIONS_TARGET_OPTIONS.SCREEN;
}

export function mapNotificationToView(notification) {
  const {
    deliveryTime,
    content: { title, summary: message = '', contentUrl = '', body },
    audience: notificationAudience,
    id,
  } = notification;

  const audience = formatGroupDisplayName(notificationAudience);
  const audienceGroups = _.get(notificationAudience, 'groups', []);

  // ! Delivery time from server is in UTC
  const deliveryDate = moment
    .utc(deliveryTime)
    .local()
    .toDate();

  const target = mapTargetTypeToView(notification);

  let bodyData;
  if (body) {
    try {
      bodyData = JSON.parse(body);
    } catch (e) {
      /* eslint-disable-next-line */
      console.warn('Error in parsing notification JSON', e);
      bodyData = {};
    }
  }

  const shortcutKey = _.get(bodyData, 'action.shortcutId', null);

  const resolvedTargetUrl =
    target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL ||
    target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.APP
      ? contentUrl
      : shortcutKey;

  return {
    id,
    audience,
    audienceGroups,
    deliveryDate,
    deliveryDisplayDate: formatDeliveryTime(deliveryDate),
    message,
    shortcutKey,
    title,
    target,
    targetUrl: resolvedTargetUrl,
  };
}

function mapTargetOptionsToApi(target) {
  if (target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL) {
    return { target: { type: 'url' } };
  }

  if (target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.APP) {
    return { target: { type: 'none' } };
  }

  return {};
}

function mapBodyToApi(target, contentUrl, title) {
  if (target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL) {
    return URL_PUSH_NOTIFICATION_ACTION(title, contentUrl);
  }

  if (target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.SCREEN) {
    return SHORTCUT_PUSH_NOTIFICATION_ACTION(contentUrl);
  }

  if (target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.APP) {
    return APP_PUSH_NOTIFICATION_ACTION(title);
  }

  return '';
}

export function mapNotificationToApi(notification) {
  const {
    audience,
    audienceGroups = [],
    title,
    message,
    delivery = PUSH_NOTIFICATION_TYPE_OPTIONS.SCHEDULED,
    deliveryTime = '',
    target = '',
    // ! targetUrl is either contentUrl or shortcut key
    targetUrl: contentUrl = null,
  } = notification;

  const deliveryOptions =
    delivery === PUSH_NOTIFICATION_TYPE_OPTIONS.SEND_NOW
      ? { delivery: 'now' }
      : { delivery: 'scheduled', deliveryTime: moment(deliveryTime).toDate() };

  const targetOptions = mapTargetOptionsToApi(target);

  const audienceOptions =
    audience === PUSH_NOTIFICATION_AUDIENCE_TYPES.BROADCAST || !audience
      ? { audience: { type: 'broadcast' } }
      : {
          audience: {
            type: 'group',
            groups: _.map(audienceGroups, group => ({
              id: group.id,
            })),
          },
        };

  const resolvedContentUrl =
    target === PUSH_NOTIFICATIONS_TARGET_OPTIONS.URL ? contentUrl : '';

  return {
    ...audienceOptions,
    ...targetOptions,
    ...deliveryOptions,
    content: {
      body: mapBodyToApi(target, contentUrl, title),
      contentUrl: resolvedContentUrl,
      summary: message,
      title,
    },
  };
}
