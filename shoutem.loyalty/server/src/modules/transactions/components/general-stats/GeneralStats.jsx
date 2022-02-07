import React from 'react';
import { Col, Row } from 'react-bootstrap';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LOYALTY_TYPES } from 'src/const';
import LOCALIZATION from './localization';
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
  };
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
  };
}

export default function GeneralStats({ generalStats, loyaltyType }) {
  const isPunchType = loyaltyType === LOYALTY_TYPES.PUNCH;

  const pointsEarnedLabel = isPunchType
    ? i18next.t(LOCALIZATION.PUNCHES_EARNED_TITLE)
    : i18next.t(LOCALIZATION.POINTS_EARNED_TITLE);
  const pointsRedeemedLabel = isPunchType
    ? i18next.t(LOCALIZATION.PUNCHES_REDEEMED_TITLE)
    : i18next.t(LOCALIZATION.POINTS_REDEEMED_TITLE);

  const stats = isPunchType
    ? calculatePunchStats(generalStats)
    : calculatePointsStats(generalStats);

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
        <div>{i18next.t(LOCALIZATION.REWARDS_REDEEMED_TITLE)}</div>
        <label>{stats.rewardsRedeemed}</label>
      </Col>
      <Col className="general-stats__item" xs={3}>
        <div>{i18next.t(LOCALIZATION.CURRENT_BALANCE_TITLE)}</div>
        <label>{stats.balance}</label>
      </Col>
    </Row>
  );
}

GeneralStats.propTypes = {
  generalStats: PropTypes.object,
  loyaltyType: PropTypes.string,
};
