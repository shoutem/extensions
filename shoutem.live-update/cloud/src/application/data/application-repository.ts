import _ from 'lodash';
import bluebird from 'bluebird';
import { Deserializer } from 'jsonapi-serializer';
import request from 'request-promise';
import URI from 'urijs';
import { errors } from '../../shared/error';
import config from '../config';

function getApplicationRequest(id: string, token: string) {
  return {
    json: true,
    method: 'GET',
    uri: new URI(config.endpoint).segment(`/v1/apps/${id}`).toString(),
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${token}`,
    },
  };
}

/**
 * Proxy app manager repository.
 */
export class ApplicationRepository {
  async getApplication(id: string, token: string) {
    try {
      const body = await request(getApplicationRequest(id, token));
      const data = await this.deserializeApplicationBody(body);

      return data;
    } catch (error) {
      throw new errors.ForbiddenError();
    }
  }

  deserializeApplicationBody(body) {
    const deserializer = new Deserializer({
      keyForAttribute: 'camelCase',
    });
    bluebird.promisifyAll(deserializer);

    return deserializer.deserializeAsync(body);
  }
}

const applicationRepository = new ApplicationRepository();
export default applicationRepository;
