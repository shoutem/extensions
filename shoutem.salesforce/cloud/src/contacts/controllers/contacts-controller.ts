import _ from 'lodash';
import { Request, Response } from 'express';
import request from 'request-promise';
import { asyncMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import { ALLOWED_CANONICAL_NAMES } from '../../const';
import { getAppId } from '../../main';
import { tokensRepository } from '../../tokens';
import { getFetchExtensionInstallationRequest } from '../../tokens';
import { getCreateContactRequest, getSearchContactsRequest, withRefreshToken } from '../services';

export class ContactsController {
  search() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const appId = getAppId(req);
      const email = _.get(req, 'body.email');
      const canonicalName = _.get(req, 'body.canonicalName', 'shoutem.salesforce');

      if (!_.includes(ALLOWED_CANONICAL_NAMES, canonicalName)) {
        throw new errors.ForbiddenError('Forbidden',
          generateErrorCode('tokens', 'forbidden', 'canonicalNameNotFound'));
      }

      if (!appId || !email) {
        throw new errors.NotFoundError('Wrong appId or no email provided',
          generateErrorCode('contacts', 'notFound', 'appNotFound'));
      }

      const extensionInstallationRequest = getFetchExtensionInstallationRequest(appId.id, canonicalName);
      const installationResponse = await request(extensionInstallationRequest);
      const installationResponseJson = JSON.parse(installationResponse.body);
      const extensionSettings = _.get(installationResponseJson, 'data.attributes.settings', {});
      const { restBaseUri, clientId } = extensionSettings;
      const appTokens = await tokensRepository.findOne({ appId: appId.id });

      if (installationResponse.statusCode !== 200 || !restBaseUri || !clientId || !appTokens) {
        throw new errors.NotFoundError('App not yet configured',
          generateErrorCode('contacts', 'notConfigured', 'appNotConfigured'));
      }

      const searchContactReq = getSearchContactsRequest(email, restBaseUri, appTokens.access_token!);
      return withRefreshToken(req, searchContactReq, installationResponseJson)
        .then(response => res.send(response))
        .catch(e => { throw e });
    });
  }

  create() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const appId = getAppId(req);
      const email = _.get(req, 'body.email');
      const canonicalName = _.get(req, 'body.canonicalName', 'shoutem.salesforce');

      if (!_.includes(ALLOWED_CANONICAL_NAMES, canonicalName)) {
        throw new errors.ForbiddenError('Forbidden',
          generateErrorCode('tokens', 'forbidden', 'canonicalNameNotFound'));
      }

      if (!appId || !email) {
        throw new errors.NotFoundError('Wrong appId or no email provided',
          generateErrorCode('contacts', 'notFound', 'appNotFound'));
      }

      const extensionInstallationRequest = getFetchExtensionInstallationRequest(appId.id, canonicalName);
      const installationResponse = await request(extensionInstallationRequest);
      const installationResponseJson = JSON.parse(installationResponse.body);
      const extensionSettings = _.get(installationResponseJson, 'data.attributes.settings', {});
      const { restBaseUri, clientId } = extensionSettings;
      const appTokens = await tokensRepository.findOne({ appId: appId.id });

      if (installationResponse.statusCode !== 200 || !restBaseUri || !clientId || !appTokens) {
        throw new errors.NotFoundError('App not yet configured',
          generateErrorCode('contacts', 'notConfigured', 'appNotConfigured'));
      }

      const createContactReq = getCreateContactRequest(email, restBaseUri, appTokens.access_token!);
      return withRefreshToken(req, createContactReq, installationResponseJson)
        .then(response => res.send(response))
        .catch(e => { throw e });
    });
  }
}

export default new ContactsController();
