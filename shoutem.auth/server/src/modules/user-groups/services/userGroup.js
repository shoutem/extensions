import _ from 'lodash';
import { getMeta } from '@shoutem/redux-io';

export function getUserGroupCount(userGroups) {
  const meta = getMeta(userGroups);
  return _.get(meta, 'count', 0);
}
