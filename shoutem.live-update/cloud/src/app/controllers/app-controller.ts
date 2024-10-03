import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import { deleteFiles } from '../../asset/services/s3-deleter';
import { getPresignedUrl } from '../../asset/services/cf-request-builder';
import appRepository from '../data/app-repository';
import { getApp } from '../service';

const BUNDLE_PROPERTIES = [
  'iosBundleUrl',
  'androidBundleUrl',
  'previewIosBundleUrl',
  'previewAndroidBundleUrl',
  'previewWebBundleUrl',
];

function presignUrlsForApp(app) {
  const clonedApp = _.cloneDeep(app);

  _.forEach(BUNDLE_PROPERTIES, bundleUrl => {
    const url = _.get(clonedApp, bundleUrl);
    if (url) {
      clonedApp[bundleUrl] = getPresignedUrl(url);
    }
  });

  return clonedApp;
}

export class AppController {
  update() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const app = getApp(req);

      const changes =
        _.pick(io.get(req), [
          'iosBinaryVersionName',
          'iosBinaryVersionCode',
          'iosBundleVersionCode',
          'iosBundleUrl',
          'androidBinaryVersionName',
          'androidBinaryVersionCode',
          'androidBundleVersionCode',
          'androidBundleUrl',
          'previewIosBundleUrl',
          'previewAndroidBundleUrl',
          'previewWebBundleUrl',
        ]) || {};

      const appUpdated = await appRepository.update(app, changes);

      // if changes were made on bundle urls, delete previous bundle urls
      const deletionUrls: string[] = [];
      _.forEach(BUNDLE_PROPERTIES, property => {
        if (!_.has(changes, property)) {
          return;
        }

        if (app[property] !== changes[property] && app[property]) {
          deletionUrls.push(app[property]);
        }
      });

      if (!_.isEmpty(deletionUrls)) {
        await deleteFiles(deletionUrls);
      }

      const signedApp = presignUrlsForApp(appUpdated);

      io.set(res, signedApp);
    });
  }

  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const app = getApp(req);
      const signedApp = presignUrlsForApp(app);

      io.set(res, signedApp);
    });
  }
}

export default new AppController();
