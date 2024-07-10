import s3Client from './s3-client';
import config from '../config';
import { getFileUrl } from './s3-url-builder';

export function getUploadUrl(fileName: string, path: string) {
  const uploadUrl = s3Client.getSignedUrl('putObject', {
    Bucket: config.s3Bucket,
    Key: path,
    Expires: config.s3UrlExpirationSeconds,
    ACL: 'private',
  });

  const downloadUrl = getFileUrl(path);
  return Promise.resolve({ id: fileName, uploadUrl, downloadUrl });
}

export function getUploadMultipartUrl(fileName: string, path: string) {
  const params = {
    Bucket: config.s3Bucket,
    Fields: {
      key: path,
    },
    Expires: config.s3UrlExpirationSeconds,
    Conditions: [
      { acl: 'public-read' },
      ['content-length-range', 100, 10000000], // 100Byte - 10MB
    ],
  };

  const uploadUrl = s3Client.createPresignedPost(params);

  const downloadUrl = getFileUrl(path);
  return Promise.resolve({ id: fileName, uploadUrl, downloadUrl });
}
