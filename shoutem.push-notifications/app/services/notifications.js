import _ from 'lodash';

export function resolveNotificationData(receivedNotification) {
  const {
    data: {
      action: unparsedAction,
      actions: unparsedActions,
      silent,
      isMultiple,
      numberOfMessages,
      title,
      text,
    },
  } = receivedNotification;

  const action = unparsedAction && JSON.parse(unparsedAction);
  const actions = unparsedActions && JSON.parse(unparsedActions);

  if (!!action) {
    const { itemId, itemSchema, shortcutId } = action;

    return {
      action,
      actions,
      body: text,
      itemId,
      itemSchema,
      silent: silent === 'true',
      isMultiple,
      numberOfMessages,
      shortcutId,
      title,
    };
  }

  return {
    action,
    actions,
    body: text,
    silent: silent === 'true',
    isMultiple,
    numberOfMessages,
    title,
  };
}
