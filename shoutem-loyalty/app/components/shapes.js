import React from 'react';

const { date, number, shape } = React.PropTypes;

const reward = shape({
  // Number of points on the card if the reward is a punch card
  points: number,
  // Number of points required to redeem the reward
  pointsRequired: number,
});

const transaction = shape({
  transactionData: shape({
    // Number of points assigned or redeemed
    points: number,
  }),
  // Timestamp
  createdAt: date,
});

export { reward, transaction };
