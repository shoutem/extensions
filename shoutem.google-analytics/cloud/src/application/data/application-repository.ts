import _ from 'lodash';
import request from 'request-promise';
import { Deserializer } from 'jsonapi-serializer';
import URI from 'urijs';
import { errors } from '../../shared/error';
import config from '../config';

const deserializer = new Deserializer({
  keyForAttribute: 'camelCase',
});

function getAppRequest(id) {
  const request = {
    json: true,
    method: 'GET',
    uri: new URI(config.endpoint).segment(`/v1/apps/${id}`).toString(),
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${config.apiToken}`,
    },
    resolveWithFullResponse: true,
    simple: false,
  };

  return request;
}

export class ApplicationRepository {
  async get(id) {
    const response = await request(getAppRequest(id));

    if (response.statusCode !== 200) {
      throw new errors.ForbiddenError();
    }

    const application = await deserializer.deserialize(response.body);

    return application;
  }
}

export default new ApplicationRepository();
