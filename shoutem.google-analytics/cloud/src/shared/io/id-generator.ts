import crypto from 'crypto';

export function generateHashId(object: object) {
  return {
    ...object,
    id: crypto.createHash('md5').update(JSON.stringify(object)).digest('hex'),
  };
}
