import _ from 'lodash';

export function getMaxLevelPoints(levels) {
  if (_.isEmpty(levels)) {
    return 0;
  }

  return _.get(_.maxBy(levels, 'numberOfPoints'), 'numberOfPoints', 0);
}
