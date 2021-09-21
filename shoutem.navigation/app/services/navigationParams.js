import _ from 'lodash';

export function getRouteParams(props = {}) {
  return _.get(props, 'route.params', {});
}
