import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { shouldRefresh } from '@shoutem/redux-io';
import {
  getGeneralStats,
  getTransactions,
  loadGeneralStats,
} from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

function resolveStatistics(userId, cardId, generalStats) {
  // Case for users with no transactions
  if (userId && !cardId) {
    return {
      earnedPoints: 0,
      balance: 0,
    };
  }

  const { totalEarnedPoints = 0, totalRedeemedPoints = 0 } = generalStats;
  const balance = _.round(totalEarnedPoints - totalRedeemedPoints, 2);

  return {
    earnedPoints: totalEarnedPoints,
    balance,
  };
}

function GeneralStats({ programId, cardId, userId }) {
  const dispatch = useDispatch();

  const transactions = useSelector(getTransactions);
  const generalStats = useSelector(getGeneralStats);

  useEffect(() => {
    dispatch(loadGeneralStats(programId, cardId));
  }, [dispatch, programId, cardId, transactions]);

  const { earnedPoints, balance } = resolveStatistics(
    userId,
    cardId,
    generalStats,
  );

  return (
    <>
      <h4 className="general-stats__title">
        {i18next.t(LOCALIZATION.OVERALL_STATISTICS)}
      </h4>
      <Row className="general-stats">
        <Col className="general-stats__item" xs={6}>
          <div>{i18next.t(LOCALIZATION.POINTS_EARNED)}</div>
          <label>{earnedPoints}</label>
        </Col>
        <Col className="general-stats__item" xs={6}>
          <div>{i18next.t(LOCALIZATION.CURRENT_BALANCE_TITLE)}</div>
          <label>{balance}</label>
        </Col>
      </Row>
    </>
  );
}

GeneralStats.propTypes = {
  programId: PropTypes.string.isRequired,
  cardId: PropTypes.string,
  userId: PropTypes.string,
};

GeneralStats.defaultProps = {
  cardId: null,
  userId: null,
};

export default GeneralStats;
