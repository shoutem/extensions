import _ from 'lodash';
import moment from 'moment';
import { AUDIENCE_TYPES, DELIVERY_TYPES, TARGET_TYPES } from '../const';

const ACTION_TYPES = {
  URL: 'shoutem.navigation.OPEN_MODAL',
  SCREEN: 'shoutem.application.EXECUTE_SHORTCUT',
};

export function mapViewToModel(notification) {
  if (!notification) {
    return null;
  }

  const model = {};

  if (notification.id) {
    _.set(model, 'id', notification.id);
  }

  const isUserScheduledNotification =
    notification.delivery === DELIVERY_TYPES.USER_SCHEDULED;

  if (isUserScheduledNotification) {
    const { action, numberOfMessages } = notification;

    const filteredSummaries = _.filter(
      notification.summaries,
      message => !_.isEmpty(message),
    );
    const body = {
      silent: true,
      isMultiple: true,
      numberOfMessages,
      action,
      actions: _.map(filteredSummaries, message => {
        return { message };
      }),
    };

    _.set(model, 'content.body', JSON.stringify(body));
    _.set(model, 'type', 'Silent');
    _.set(notification, 'target.type', null);
    _.set(model, 'delivery', DELIVERY_TYPES.SCHEDULED);
  }

  if (
    !isUserScheduledNotification &&
    notification.target === TARGET_TYPES.APP
  ) {
    const action = {
      action: {
        route: {
          key: `push-${new Date().getTime().toString()}`,
          props: {
            title: notification.title,
          },
        },
      },
    };

    _.set(model, 'target.type', notification.target);
    _.set(model, 'content.body', JSON.stringify(action));
  }

  if (
    !isUserScheduledNotification &&
    notification.target === TARGET_TYPES.URL
  ) {
    const action = {
      action: {
        route: {
          key: `push-${new Date().getTime().toString()}`,
          screen: 'shoutem.web-view.WebViewScreen',
          props: {
            url: notification.contentUrl,
            title: notification.title,
            showNavigationToolbar: true,
          },
        },
        type: ACTION_TYPES.URL,
      },
    };

    _.set(model, 'target.type', notification.target);
    _.set(model, 'content.body', JSON.stringify(action));
  }

  if (
    !isUserScheduledNotification &&
    notification.target === TARGET_TYPES.SCREEN
  ) {
    const action = {
      action: {
        type: ACTION_TYPES.SCREEN,
        navigationAction: 'shoutem.navigation.OPEN_MODAL',
        shortcutId: notification.shortcutId,
      },
    };

    _.set(model, 'content.body', JSON.stringify(action));
  }

  _.set(model, 'audience.type', notification.audience);
  if (notification.audience === AUDIENCE_TYPES.GROUP) {
    const groups = _.map(notification.audienceGroupIds, id => ({ id }));
    _.set(model, 'audience.groups', groups);
  }

  // User scheduled delivery is already handled
  if (!isUserScheduledNotification) {
    _.set(model, 'delivery', notification.delivery);
  }

  if (notification.delivery !== DELIVERY_TYPES.NOW) {
    const utcTime = moment.utc(notification.deliveryTime).toISOString();
    _.set(model, 'deliveryTime', utcTime);
  }

  if (notification.target === TARGET_TYPES.URL) {
    _.set(model, 'content.contentUrl', notification.contentUrl);
  }

  const iconUrl = _.get(notification, 'iconUrl');
  if (!_.isEmpty(iconUrl)) {
    _.set(model, 'content.iconUrl', notification.iconUrl);
  }

  const imageUrl = _.get(notification, 'imageUrl');
  if (!_.isEmpty(imageUrl)) {
    _.set(model, 'content.imageUrl', notification.imageUrl);
  }

  _.set(model, 'content.title', notification.title);
  _.set(model, 'content.summary', notification.summary);
  _.set(model, 'recurringPeriod', notification.recurringPeriod);

  return model;
}

export function mapModelToView(notification) {
  if (!notification) {
    return null;
  }

  const view = {};

  _.set(view, 'id', notification.id);

  const isUserScheduledNotification = notification.type === 'Silent';

  if (isUserScheduledNotification) {
    const body = JSON.parse(_.get(notification, 'content.body'));
    const summaries = _.map(body.actions, summary => summary.message);

    _.set(view, 'summaries', summaries);
    _.set(view, 'numberOfMessages', body.numberOfMessages);
    _.set(view, 'type', 'Silent');
  }

  const audienceType = _.get(notification, 'audience.type');
  _.set(view, 'audience', audienceType);

  if (audienceType === AUDIENCE_TYPES.GROUP) {
    const groups = _.get(notification, 'audience.groups');
    const groupIds = _.map(groups, group => _.toString(group.id));

    _.set(view, 'audienceGroupIds', groupIds);
    _.set(view, 'audienceGroups', groups);
  }

  const contentBody = JSON.parse(_.get(notification, 'content.body'));
  const action = _.get(contentBody, 'action.type');

  if (action === ACTION_TYPES.URL) {
    _.set(view, 'target', TARGET_TYPES.URL);
    _.set(view, 'contentUrl', _.get(notification, 'content.contentUrl'));
  }

  if (action === ACTION_TYPES.SCREEN) {
    _.set(view, 'target', TARGET_TYPES.SCREEN);
    _.set(view, 'shortcutId', _.get(contentBody, 'action.shortcutId'));
  }

  _.set(view, 'title', _.get(notification, 'content.title'));
  _.set(view, 'summary', _.get(notification, 'content.summary'));
  _.set(view, 'iconUrl', _.get(notification, 'content.iconUrl'));
  _.set(view, 'imageUrl', _.get(notification, 'content.imageUrl'));

  const deliveryTime = _.get(notification, 'deliveryTime');
  if (deliveryTime) {
    const utcTime = moment.utc(deliveryTime).toISOString();
    _.set(view, 'deliveryTime', utcTime);
  } else {
    _.set(view, 'deliveryTime', deliveryTime);
  }

  if (notification.active) {
    _.set(view, 'delivery', DELIVERY_TYPES.SCHEDULED);
  } else {
    _.set(view, 'delivery', DELIVERY_TYPES.NOW);
  }

  _.set(view, 'recurringPeriod', _.get(notification, 'recurringPeriod'));

  return view;
}
