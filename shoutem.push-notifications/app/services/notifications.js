import _ from 'lodash';

export function resolveNotificationData(receivedNotification) {
  const {
    data,
    title,
    text,
    message,
    action: unparsedAction,
  } = receivedNotification;
  const dataText = _.get(data, 'text');
  const dataTitle = _.get(data, 'title');

  const action = unparsedAction && JSON.parse(unparsedAction);
  const itemId = _.get(action, 'itemId');
  const itemSchema = _.get(action, 'itemSchema');
  const shortcutId = _.get(action, 'shortcutId');
  const unparsedDataAction = _.get(data, 'action');

  const dataAction = unparsedDataAction && JSON.parse(unparsedDataAction);
  const dataItemId = _.get(dataAction, 'itemId');
  const dataItemSchema = _.get(dataAction, 'itemSchema');
  const dataShortcutId = _.get(dataAction, 'shortcutId');

  if (!title && !text && !dataText && !dataTitle && !message) {
    return false;
  }

  const hasMessage = !_.isEmpty(message) && _.isString(message);

  const resolvedTitle = title || dataTitle;
  const resolvedText = hasMessage ? message : text || dataText;
  const resolvedAction = action || dataAction;
  const resolvedItemId = itemId || dataItemId;
  const resolvedItemSchema = itemSchema || dataItemSchema;
  const resolvedShortcutId = shortcutId || dataShortcutId;

  return {
    title: resolvedTitle,
    body: resolvedText,
    action: resolvedAction,
    itemId: resolvedItemId,
    itemSchema: resolvedItemSchema,
    shortcutId: resolvedShortcutId,
  };
}
