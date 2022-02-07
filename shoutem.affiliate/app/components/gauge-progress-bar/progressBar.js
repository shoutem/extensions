// Actually, visible angles of gauge are -45 deg to 225 deg
const END_ANGLE = 270;

export function angleToRadians(angle) {
  return (angle * Math.PI) / 180;
}

// Only 3/4 of circle are visible
export function getGaugeCircleCircumference(radius) {
  return 1.5 * Math.PI * radius;
}

export function getFullCircleCircumference(radius) {
  return 2 * Math.PI * radius;
}

export function getProgressCircleCircumference(
  progressValue,
  maxValue,
  circumference,
) {
  if (maxValue <= 0) {
    return 0;
  }

  let pointsPercentage = (progressValue / maxValue) * 100;
  if (pointsPercentage > 100) {
    pointsPercentage = 100;
  }

  return (pointsPercentage / 100) * circumference;
}

export function getLevelIconCoordinates(reward, maxPoints, width, radius) {
  const { pointsRequired } = reward;

  let pointsPercentage = (pointsRequired / maxPoints) * 100;
  if (pointsPercentage > 100) {
    pointsPercentage = 100;
  }

  let pointsAngle = END_ANGLE - (pointsPercentage / 100) * END_ANGLE - 45;
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
