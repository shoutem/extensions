import _ from 'lodash';
import { Request, Response } from 'express';
import request from 'request-promise';
import { asyncMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import tokensRepository from '../data/tokens-repository';
import { authTokensRepository } from '../../authTokens';
import { getShopifyStorefrontTokenRequest } from '../services';

export class TokensController {
  create() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const appId = _.get(req, 'query.appId');
      const shop = _.get(req, 'query.shop');

      if (!appId || !shop) {
        throw new errors.NotAuthorizedError(
          'Invalid token request',
          generateErrorCode('Shopify-Token', 'invalidCall', 'missingAppIdOrShop'),
        );
      }

      const authToken = await authTokensRepository.findOne({ shop });

      if (!authToken) {
        throw new errors.NotAuthorizedError(
          'Selected shop not authorized',
          generateErrorCode('Shopify-Token', 'invalidCall', 'shopNotAuthorized'),
        );
      }

      try {
        const getTokenRequest = getShopifyStorefrontTokenRequest(appId, shop, authToken.access_token);
        const response = await request(getTokenRequest);
        const tokenResponseJson = JSON.parse(response);

        const token = _.get(tokenResponseJson, 'storefront_access_token');

        _.set(token, 'appId', appId);
        _.set(token, 'external_id', token.id);
        _.set(token, 'shop', shop);
        _.unset(token, 'id');

        const existingToken = await tokensRepository.findOne({ appId, shop });

        if (existingToken) {
          const tokenUpdated = await tokensRepository.update(existingToken.id, token);
          res.send(tokenUpdated);
        } else {
          const tokenCreated = await tokensRepository.create(token);
          res.send(tokenCreated);
        }
      } catch (e) {
        res.send(e);
      }
    });
  }

  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const appId = _.get(req, 'query.appId');
      const shop = _.get(req, 'query.shop');

      if (!appId) {
        throw new errors.NotAuthorizedError(
          'Invalid token request',
          generateErrorCode('Shopify-Token', 'invalidCall', 'missingAppIdOrShop'),
        );
      }
      const existingToken = await tokensRepository.findOne({ appId, shop });

      if (existingToken) {
        res.send(existingToken);
      } else {
        res.send({});
      }
    });
  }
}

export default new TokensController();
