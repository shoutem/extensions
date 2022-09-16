import _ from 'lodash';
import { Request, Response } from 'express';
import request from 'request-promise';
import { asyncMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import tokensRepository from '../data/tokens-repository';
import config from '../../shared/config';
import {
  getShopifyPermanentTokenRequest,
  getShopifyAppInstallUrl,
  verifyRedirectCodes,
  verifyWebhookHmac,
} from '../services';

export class TokensController {
  authorize() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const grantCode = _.get(req, 'query.code');
      const hmac = _.get(req, 'query.hmac');
      const host = _.get(req, 'query.host');
      const shop = _.get(req, 'query.shop');

      if (!grantCode || !hmac || !host || !shop) {
        throw new errors.NotAuthorizedError(
          'Invalid redirect call',
          generateErrorCode('Shopify-OAuth', 'invalid', 'invalidRedirectCall'),
        );
      }

      const requestVerified = verifyRedirectCodes(req.query);

      if (!requestVerified) {
        throw new errors.NotAuthorizedError(
          'Invalid redirect call',
          generateErrorCode('Shopify-OAuth', 'invalid', 'hmacVerificationFailed'),
        );
      }

      try {
        const getTokensRequest = getShopifyPermanentTokenRequest(grantCode, shop);
        const tokensResponse = await request(getTokensRequest);
        const tokensResponseJson = JSON.parse(tokensResponse);
        _.set(tokensResponseJson, 'shop', shop);

        const shopFrameAncestor = `https://${shop}`;

        const tokensExist = await tokensRepository.findOne({ shop });

        res.set("Content-Security-Policy", `frame-ancestors ${shopFrameAncestor} https://admin.shopify.com;`);

        if (tokensExist) {
          await tokensRepository.update(tokensExist.id, tokensResponseJson);
          res.redirect(`${config.baseEndpoint}/status?success=true`);

        } else {
          await tokensRepository.create(tokensResponseJson);
          res.redirect(`${config.baseEndpoint}/status?success=true`);
        }
      } catch (e) {
        res.redirect(`${config.baseEndpoint}/status?success=false`);
      }
    });
  }

  checkAuthorization() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const shop = _.get(req, 'query.shop');

      if (!shop) {
        throw new errors.NotFoundError('Invalid shop', generateErrorCode('Validity-check', 'invalid', 'invalidShop'));
      }

      const tokensExist = await tokensRepository.findOne({ shop });
      const responseJson = {
        authorized: !!tokensExist,
        shop,
      };

      res.send(responseJson);
    });
  }

  install() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const shop = _.get(req, 'query.shop');

      if (!shop) {
        throw new errors.NotFoundError('Invalid shop', generateErrorCode('Install app', 'invalid', 'invalidShop'));
      }

      const shopFrameAncestor = `https://${shop}`;

      res.set("Content-Security-Policy", `frame-ancestors https://admin.shopify.com ${shopFrameAncestor};`);

      const redirectUri = getShopifyAppInstallUrl(shop);

      res.redirect(redirectUri);
    });
  }

  // We're currently not storing any customer data on our end
  requestCustomerData() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const hmacVerified = verifyWebhookHmac(req);

      if (!hmacVerified) {
        throw new errors.NotAuthorizedError(
          'Invalid request signature',
          generateErrorCode('Request_customer_data', 'invalid', 'invalidHmacSignature'),
        );
      }
  
      res.sendStatus(200);
    });
  }

  // We're currently not storing any customer data on our end
  redactCustomerData() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const hmacVerified = verifyWebhookHmac(req);

      if (!hmacVerified) {
        throw new errors.NotAuthorizedError(
          'Invalid request signature',
          generateErrorCode('Request_customer_data', 'invalid', 'invalidHmacSignature'),
        );
      }

      res.sendStatus(200);
    });
  }

  redactShop() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const data = req.body;
      const { shop_domain } = data;

      const hmacVerified = verifyWebhookHmac(req);

      if (!hmacVerified) {
        throw new errors.NotAuthorizedError(
          'Invalid request signature',
          generateErrorCode('Request_customer_data', 'invalid', 'invalidHmacSignature'),
        );
      }
  
      const tokensExist = await tokensRepository.findOne({ shop: shop_domain });
  
      if (tokensExist) {
        // remove storefront token
        await tokensRepository.remove(tokensExist.id);
      }
  
      res.sendStatus(200);
    });
  }
}

export default new TokensController();
