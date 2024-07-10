import { requireEnvString, requireEnvNumber } from '../../shared/env';

requireEnvString('AWS_ACCESS_KEY_ID');
requireEnvString('AWS_SECRET_ACCESS_KEY');

export default {
  s3Region: requireEnvString('AWS_S3_REGION'),
  s3Bucket: requireEnvString('AWS_S3_BUCKET'),
  s3UrlExpirationSeconds: requireEnvNumber('AWS_S3_URL_EXPIRATION_SECONDS', 600),
  cloudfrontKeypairId: requireEnvString('AWS_CLOUDFRONT_KEYPAIR_ID'),
  cloudfrontPrivateKey: Buffer.from(requireEnvString('AWS_CLOUDFRONT_PRIVATE_KEY_BASE64'), 'base64').toString('ascii'),
};
