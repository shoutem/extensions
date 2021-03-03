import { Request } from 'express';
import _ from 'lodash';
import URI from 'urijs';
import { formatParams } from './params';
import { Status } from '../const';
import config from '../../shared/config';

export function createLikeRequest(req: Request, status: Status): object {
  const appId = req.body.data.appId;

  const params = formatParams({
    nid: appId,
    design_mode: true,
  })

  const endpointSuffix = `/api/favorites/create/${status.id}.json`;

  return {
    method: 'POST',
    resourceType: 'JSON',
    uri: new URI(config.servicesLegacyBackend).segment(endpointSuffix).query(`${params}`).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': req.headers.authorization,
    },
    body: formatParams({ nid: appId }),
    resolveWithFullResponse: true,
    simple: false,
  };
}
