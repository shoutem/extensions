import URI from 'urijs';
import config from '../config';

export function getFileUrl(filePath) {
  return new URI(`https://${config.s3Bucket}/${filePath}`).toString();
}
