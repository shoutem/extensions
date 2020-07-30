import uuid from 'uuid/v4';

export function generateUuid() {
  return uuid().replace(/-/g, '');
}
