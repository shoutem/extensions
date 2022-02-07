import request from 'request-promise';
import { Request } from 'express';
import { getAppId } from '../../main';
import { getRefreshSalesforceTokenRequest, tokensRepository } from '../../tokens';

export async function withRefreshToken(mainReq: Request, requestData: any, extInstallation: object): Promise<object> {
  return request(requestData)
    .then(response => JSON.parse(response))
    .catch(async e => {
      const isAuthIssue = e.statusCode === 401;

      if (isAuthIssue) {
        const appId = getAppId(mainReq);
        const appTokens = await tokensRepository.findOne({ appId: appId.id });
        const refreshTokenReq = getRefreshSalesforceTokenRequest(appTokens.refresh_token!, extInstallation);
        const refreshResponse = await request(refreshTokenReq);

        const refreshResponseJson = JSON.parse(refreshResponse);

        await tokensRepository.update(appTokens.id, refreshResponseJson);
        const newSignedRequestData = {
          ...requestData,
          headers: {
            ...requestData.headers,
            Authorization: `Bearer ${refreshResponseJson.access_token}`
          }
        };

        return request(newSignedRequestData).then(response => JSON.parse(response)).catch(e => { throw e });
      }

      throw e;
    })
}
