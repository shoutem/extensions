import _ from 'lodash';
import { angleToRadians } from './gauge-progress-bar';

// Actually, visible angles of gauge are -45 deg to 225 deg
const endAngle = 270;

export function getMaxRewardPoints(rewards) {
  if (_.isEmpty(rewards)) {
    return 0;
  }

  return _.get(_.maxBy(rewards, 'pointsRequired'), 'pointsRequired', 0);
}

export function getRewardCoordinates(reward, maxPoints, width, radius) {
  const { pointsRequired } = reward;

  let pointsPercentage = (pointsRequired / maxPoints) * 100;
  if (pointsPercentage > 100) {
    pointsPercentage = 100;
  }

  let pointsAngle = endAngle - (pointsPercentage / 100) * endAngle - 45;
  if (pointsAngle < 0) {
    pointsAngle += 360;
  }

  const pointsAngleRad = angleToRadians(pointsAngle);
  const progressCenter = width / 2;
  const x = progressCenter + radius * Math.cos(pointsAngleRad);
  const y = progressCenter + radius * -Math.sin(pointsAngleRad);

  return {
    left: x,
    top: y,
  };
}
