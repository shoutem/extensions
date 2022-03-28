import _ from 'lodash';
import URI from 'urijs';
import config from '../../shared/config';
import { Request } from 'express';
import { Status } from '../const';
import { formatParams } from './params';

export function createCommentRequest(req: Request, status: Status): object {
  const { data } = req.body;
  const { appId, text, imageData, imageUrl } = data;

  const params = formatParams({
    nid: appId,
    in_reply_to_status_id: status.id,
  });

  const body = {
    status: text,
    include_shoutem_fields: true,
    source: 'Mobile',
    nid: appId,
  };

  if (imageData) {
    _.set(body, 'file_attachment', imageData);
  }

  if (imageUrl) {
    _.set(body, 'link_attachment', imageUrl);
  }  

  const endpointSuffix = '/api/statuses/update.json';

  return {
    method: 'POST',
    resourceType: 'JSON',
    uri: new URI(config.servicesLegacyBackend).segment(endpointSuffix).query(`${params}`).toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': req.headers.authorization,
    },
    body: formatParams(body),
    resolveWithFullResponse: true,
    simple: false,
  };
}
