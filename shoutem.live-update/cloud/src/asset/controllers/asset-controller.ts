import _ from 'lodash';
import path from 'path';
import { io } from '../../shared/io';
import { getUploadUrl, getUploadMultipartUrl } from '../services/s3-request-builder';
import { getAssetName } from '../services/asset';
import { getLocals } from '../../shared/express';

export class AssetController {
  getUploadRequestParams() {
    return (req, res, next) => {
      const fileName = _.toString(_.get(io.get(req), 'fileName'));

      const assetName = getAssetName(fileName);
      const assetsPath = getLocals(req, 'assetsPath') as string;

      return getUploadUrl(assetName, path.join(assetsPath, assetName))
        .then(uploadData => {
          io.setCreated(res, uploadData);
          next();
        })
        .catch(next);
    };
  }

  getUploadMultipartParams() {
    return (req, res, next) => {
      const fileName = _.toString(_.get(io.get(req), 'fileName'));

      const assetName = getAssetName(fileName);
      const assetsPath = getLocals(req, 'assetsPath') as string;

      return getUploadMultipartUrl(assetName, path.join(assetsPath, assetName))
        .then(uploadData => {
          io.setCreated(res, uploadData);
          next();
        })
        .catch(next);
    };
  }
}

export default new AssetController();
