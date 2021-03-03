export function angleToRadians(angle) {
  return (angle * Math.PI) / 180;
}

// Only 3/4 of circle are visible
export function getGaugeCircleCircumference(radius) {
  return 1.5 * Math.PI * radius;
}

// Circumference of a full circle
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
