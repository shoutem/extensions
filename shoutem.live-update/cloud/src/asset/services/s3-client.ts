import AWS from 'aws-sdk';
import config from '../config';

export default new AWS.S3({
  signatureVersion: 'v4',
  region: config.s3Region,
});
