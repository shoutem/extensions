import _ from 'lodash';

export function resolveNotificationData(receivedNotification) {
  const { data, title, text, message } = receivedNotification;
  const dataText = _.get(data, 'text');
  const dataTitle = _.get(data, 'title');

  if (!title && !text && !dataText && !dataTitle && !message) {
    return false;
  }

  const resolvedTitle = title || dataTitle;
  const resolvedText = message || text || dataText;

  return {
    title: resolvedTitle,
    body: resolvedText,
  };
}
