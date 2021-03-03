import _ from 'lodash';

export default function isGroupVisible(userGroups, id) {
  const group = _.find(userGroups, { id });

  const visible = _.get(group, 'visible', true);

  return visible;
}
