import _ from 'lodash';
import { DEFAULT_LIMIT } from '../redux';
import { getMeta } from '@shoutem/redux-io';

export function getMemberCount(members) {
  const meta = getMeta(members);
  return _.get(meta, 'count', DEFAULT_LIMIT);
}
