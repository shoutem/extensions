import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { LOYALTY_TYPES } from 'src/const';
import './style.scss';

function calculatePointsStats(generalStats) {
  const totalEarnedPoints = _.get(generalStats, 'totalEarnedPoints', 0);
  const totalRedeemedPoints = _.get(generalStats, 'totalRedeemedPoints', 0);
  const rewardsRedeemed = _.get(generalStats, 'redeemedPoints', 0);
  const balance = _.round(totalEarnedPoints - totalRedeemedPoints, 2);

  return {
    balance,
    rewardsRedeemed,
    pointsRedeemed: totalRedeemedPoints,
    pointsEarned: totalEarnedPoints,
  }
}

function calculatePunchStats(generalStats) {
  const totalEarnedPunches = _.get(generalStats, 'totalEarnedPunches', 0);
  const totalRedeemedPunches = _.get(generalStats, 'totalRedeemedPunches', 0);
  const rewardsRedeemed = _.get(generalStats, 'redeemedPunches', 0);
  const balance = _.round(totalEarnedPunches - totalRedeemedPunches, 2);

  return {
    balance,
    rewardsRedeemed,
    pointsRedeemed: totalRedeemedPunches,
    pointsEarned: totalEarnedPunches,
  }
}

export default function GeneralStats({ generalStats, loyaltyType }) {
  const isPunchType = loyaltyType === LOYALTY_TYPES.PUNCH;

  const pointsEarnedLabel = isPunchType ? 'Punches earned' : 'Points earned';
  const pointsRedeemedLabel = isPunchType ? 'Punches redeemed' : 'Points redeemed';

  const stats = (
    isPunchType ?
      calculatePunchStats(generalStats) :
      calculatePointsStats(generalStats)
  );

  return (
    <Row className="general-stats">
      <Col className="general-stats__item" xs={3}>
        <div>{pointsEarnedLabel}</div>
        <label>{stats.pointsEarned}</label>
      </Col>
      <Col className="general-stats__item" xs={3}>
        <div>{pointsRedeemedLabel}</div>
        <label>{stats.pointsRedeemed}</label>
      </Col>
      <Col className="general-stats__item" xs={3}>
        <div>Rewards redeemed</div>
        <label>{stats.rewardsRedeemed}</label>
      </Col>
      <Col className="general-stats__item" xs={3}>
        <div>Current balance</div>
        <label>{stats.balance}</label>
      </Col>
    </Row>
  );
}

GeneralStats.propTypes = {
  generalStats: PropTypes.object,
  loyaltyType: PropTypes.string,
};
