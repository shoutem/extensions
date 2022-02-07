import _ from 'lodash';

export default function resolveProp(item, propResolver, fallback) {
  return _.isFunction(propResolver)
    ? propResolver(item)
    : _.get(item, propResolver, fallback);
}
