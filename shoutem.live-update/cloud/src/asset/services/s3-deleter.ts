import _ from 'lodash';
import { logger } from '../../shared/logging';
import config from '../config';
import s3Client from './s3-client';

export async function deleteFiles(urls) {
  const deletionObjects: any = [];

  _.forEach(urls, url => {
    if (_.includes(url, config.s3Bucket)) {
      let s3fileKey = _.split(url, config.s3Bucket)[1];
      if (_.startsWith(s3fileKey, '/')) {
        s3fileKey = s3fileKey.substring(1);
      }

      deletionObjects.push({ Key: s3fileKey });
    }
  });

  if (_.isEmpty(deletionObjects)) {
    return;
  }

  const s3FilesDeleteParams = {
    Bucket: config.s3Bucket,
    Delete: {
      Objects: deletionObjects,
    },
  };

  try {
    await s3Client.deleteObjects(s3FilesDeleteParams).promise();
  } catch (error) {
    logger.error(error);
  }
}
