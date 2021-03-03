import _ from 'lodash';

export function pickCamelCase(object, keys) {
  return _.mapKeys(_.pick(object, keys), (v, k) => _.camelCase(k));
}

class KeyValue {
  key!: string;
  value;
}

export function getOwnProperties(object: object): KeyValue[] {
  const props: KeyValue[] = [];
  if (!object) return props;

  _.forOwn(object, (value, key) => {
    props.push({ key, value });
  });

  return props;
}
