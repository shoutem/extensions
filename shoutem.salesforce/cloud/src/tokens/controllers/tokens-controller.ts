import _ from 'lodash';
import { Request, Response } from 'express';
import request from 'request-promise';
import { asyncMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import { ALLOWED_CANONICAL_NAMES } from '../../const';
import { getAppId } from '../../main';
import tokensRepository from '../data/tokens-repository';
import {
  getFetchExtensionInstallationRequest,
  getObtainSalesforceTokensRequest,
  getSalesforceAuthorizedRequest,
} from '../services';

export class TokensController {
  create() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const appId = getAppId(req);
      const grantCode = _.get(req, 'query.code');
      const canonicalName = _.get(req, 'query.canonicalName', 'shoutem.salesforce');

      if (!_.includes(ALLOWED_CANONICAL_NAMES, canonicalName)) {
        throw new errors.ForbiddenError('Forbidden',
          generateErrorCode('tokens', 'forbidden', 'canonicalNameNotFound'));
      }

      if (!appId || !grantCode) {
        throw new errors.NotFoundError('App not found or ready',
          generateErrorCode('tokens', 'notFound', 'appNotFound'));
      }
      
      const extensionInstallationRequest = getFetchExtensionInstallationRequest(appId.id, canonicalName);

      try {
        const installationResponse = await request(extensionInstallationRequest);
        const installationResponseJson = JSON.parse(installationResponse.body);
        const extensionSettings = _.get(installationResponseJson, 'data.attributes.settings', {});
        const { authBaseUri, clientId } = extensionSettings;

        if (installationResponse.statusCode !== 200 || !authBaseUri || !clientId) {
          throw new errors.NotFoundError('App not yet configured',
            generateErrorCode('tokens', 'notConfigured', 'appNotConfigured'));
        }

        const getTokensRequest = getObtainSalesforceTokensRequest(grantCode, installationResponseJson);
        const tokensResponse = await request(getTokensRequest);
        const tokensResponseJson = JSON.parse(tokensResponse);
        _.set(tokensResponseJson, 'appId', appId.id);

        const tokensExist = await tokensRepository.findOne({ appId: appId.id });
        const authorizeSalesforceRequest = getSalesforceAuthorizedRequest(appId.id, installationResponseJson);

        if (tokensExist) {
          const tokensUpdated = await tokensRepository.update(tokensExist.id, tokensResponseJson);
          await request(authorizeSalesforceRequest);
          res.send(tokensUpdated);
        } else {
          const tokensCreated = await tokensRepository.create(tokensResponseJson);

          await request(authorizeSalesforceRequest);
          res.send(tokensCreated);
        }
      } catch (e) {
        res.send(e);
      }
    });
  }
}

export default new TokensController();
