import _ from 'lodash';
import io from 'jsonapi-serializer';
import { getOwnProperties } from '../../core/lodash-extensions';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function verifyEquality(original, returned): boolean {
  const originalProperties = getOwnProperties(original);
  const propNames = _.map(originalProperties, (p) => p.key);
  const leanReturned = _.pick(returned, propNames);

  return _.isEqual(original, leanReturned);
}

const deserializer = new io.Deserializer({
  keyForAttribute: (name) => _.camelCase(name),
});
export function parseResponse(body: string): Promise<any> {
  return deserializer.deserialize(body);
}

export const getSerializer = (type, attributes) => {
  const serializer = new io.Serializer(type, {
    attributes,
    keyForAttribute: (name) => _.camelCase(name),
  });

  return serializer;
};

export const jsonApiContentType = 'application/vnd.api+json';
