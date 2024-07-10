import express, { Router } from 'express';
import { jsonapi } from '../../shared/io';
import '../io';
import controller from '../controllers/asset-controller';
import { setupAssetsPath, assertCanUpload } from '../middleware';
import { ASSET_TYPE } from '../io/types';

const assetRouter: Router = express.Router();

/**
 * @swagger
 * /v1/apps/{appId}/assets/actions/upload:
 *   post:
 *     tags:
 *     - Asset
 *     summary: Returns data required to upload and download a file
 *     parameters:
 *     - $ref: '#/parameters/appId'
 *     - name: assetData
 *       in: body
 *       schema:
 *         $ref: '#/definitions/AssetJsonApiDocument'
 *     responses:
 *       '201':
 *         description: upload params
 *         schema:
 *           $ref: '#/definitions/AssetJsonApiDocument'
 */
assetRouter.post(
  '/actions/upload',
  jsonapi.parseInput(ASSET_TYPE),
  assertCanUpload(),
  setupAssetsPath(),
  controller.getUploadRequestParams(),
  jsonapi.generateOutput(ASSET_TYPE),
);

/**
 * @swagger
 * /v1/apps/{appId}/assets/actions/upload-multipart:
 *   post:
 *     tags:
 *     - Asset
 *     summary: Returns multipart data required to upload and download a file
 *     parameters:
 *     - $ref: '#/parameters/appId'
 *     - name: assetData
 *       in: body
 *       schema:
 *         $ref: '#/definitions/AssetJsonApiDocument'
 *     responses:
 *       '201':
 *         description: upload params
 *         schema:
 *           $ref: '#/definitions/AssetJsonApiDocument'
 */
assetRouter.post(
  '/actions/upload-multipart',
  jsonapi.parseInput(ASSET_TYPE),
  assertCanUpload(),
  setupAssetsPath(),
  controller.getUploadMultipartParams(),
  jsonapi.generateOutput(ASSET_TYPE),
);

export { assetRouter };
