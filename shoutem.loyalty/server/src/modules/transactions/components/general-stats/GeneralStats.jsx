import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { LOYALTY_TYPES } from 'src/const';
import './style.scss';

export default function GeneralStats({ generalStats, loyaltyType }) {
  const {
    redeems,
    totalEarnedPunches,
    totalRedeemedPunches,
    totalEarnedPoints,
    totalRedeemedPoints,
  } = generalStats;

  const pointsEarnedLabel = (loyaltyType === LOYALTY_TYPES.PUNCH) ?
    'Punches earned' :
    'Points earned';

  const pointsRedeemedLabel = (loyaltyType === LOYALTY_TYPES.PUNCH) ?
    'Punches redeemed' :
    'Points redeemed';

  const pointsEarned = (loyaltyType === LOYALTY_TYPES.PUNCH) ?
    totalEarnedPunches :
    totalEarnedPoints;

  const pointsRedeemed = (loyaltyType === LOYALTY_TYPES.PUNCH) ?
    totalRedeemedPunches :
    totalRedeemedPoints;

  const balance = _.round(pointsEarned - pointsRedeemed, 2);

  return (
    <Row className="general-stats">
      <Col className="general-stats__item" xs={3}>
        <div>{pointsEarnedLabel}</div>
        <label>{pointsEarned}</label>
      </Col>
      <Col className="general-stats__item" xs={3}>
        <div>{pointsRedeemedLabel}</div>
        <label>{pointsRedeemed}</label>
      </Col>
      <Col className="general-stats__item" xs={3}>
        <div>Rewards redeemed</div>
        <label>{redeems}</label>
      </Col>
      <Col className="general-stats__item" xs={3}>
        <div>Current balance</div>
        <label>{balance}</label>
      </Col>
    </Row>
  );
}

GeneralStats.propTypes = {
  generalStats: PropTypes.object,
  loyaltyType: PropTypes.string,
};
