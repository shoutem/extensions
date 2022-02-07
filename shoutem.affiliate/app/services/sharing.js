export function formatShareMessage(message, value) {
  if (!message) {
    return '';
  }
  return message.replace(new RegExp('{{1,2}(.*|(code))}{1,2}', 'g'), value);
}
