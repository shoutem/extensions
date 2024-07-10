import _ from 'lodash';
import cfsign from 'aws-cloudfront-sign';
import config from '../config';

export function getPresignedUrl(url) {
  if (!_.includes(url, config.s3Bucket)) {
    return url;
  }

  var expireTime = new Date();
  expireTime.setHours(expireTime.getHours() + 1);

  var signingParams = {
    keypairId: config.cloudfrontKeypairId,
    privateKeyString: config.cloudfrontPrivateKey,
    expireTime,
  };

  return cfsign.getSignedUrl(url, signingParams);
}
