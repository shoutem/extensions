import config from '../config';
import s3Client from './s3-client';
import { getFileUrl } from './s3-url-builder';

export function uploadFile(path, content) {
  return new Promise((resolve, reject) => {
    s3Client.putObject(
      {
        Bucket: config.s3Bucket,
        Key: path,
        ACL: 'public-read',
        Body: content,
      },
      err => {
        if (err) {
          return reject(err);
        }
        return resolve(getFileUrl(path));
      },
    );
  });
}
