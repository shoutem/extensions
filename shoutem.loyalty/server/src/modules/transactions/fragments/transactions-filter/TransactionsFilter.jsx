import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LOYALTY_TYPES } from 'src/const';
import { getCashiers } from 'src/modules/cashiers';
import { getLoyaltyPlaces, getUsers } from 'src/modules/program';
import { getPunchRewards } from 'src/modules/punch-rewards';
import { createSelectOptions } from 'src/services';
import {
  formatCashierLabel,
  formatPlaceLabel,
  formatRewardLabel,
  formatUserLabel,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export class TransactionsFilter extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleUserChange(user) {
    const userId = _.get(user, 'value');
    this.props.onFilterChange({ userId });
  }

  handlePlaceChange(place) {
    const placeId = _.get(place, 'value');
    this.props.onFilterChange({ placeId });
  }

  handleCashierChange(cashier) {
    const cashierId = _.get(cashier, 'value');
    this.props.onFilterChange({ cashierId });
  }

  handleRewardChange(reward) {
    const rewardId = _.get(reward, 'value');
    this.props.onFilterChange({ rewardId });
  }

  render() {
    const {
      loyaltyType,
      users,
      cashiers,
      places,
      rewards,
      filter,
    } = this.props;

    const colSize = loyaltyType === LOYALTY_TYPES.POINTS ? 6 : 4;

    return (
      <Row className="transactions-filter">
        <Col xs={colSize}>
          <Select
            autoBlur
            clearable
            onChange={this.handleUserChange}
            options={createSelectOptions(users, formatUserLabel, 'legacyId')}
            placeholder={i18next.t(
              LOCALIZATION.FILTER_BY_USER_PLACEHOLDER_MESSAGE,
            )}
            value={filter.userId}
          />
        </Col>
        {loyaltyType === LOYALTY_TYPES.PUNCH && (
          <Col xs={colSize}>
            <Select
              autoBlur
              clearable
              onChange={this.handleRewardChange}
              options={createSelectOptions(rewards, formatRewardLabel)}
              placeholder={i18next.t(
                LOCALIZATION.FILTER_BY_CARD_PLACEHOLDER_MESSAGE,
              )}
              value={filter.rewardId}
            />
          </Col>
        )}
        {loyaltyType === LOYALTY_TYPES.MULTI && (
          <Col xs={colSize}>
            <Select
              autoBlur
              clearable
              onChange={this.handlePlaceChange}
              options={createSelectOptions(places, formatPlaceLabel)}
              placeholder={i18next.t(
                LOCALIZATION.FILTER_BY_PLACE_PLACEHOLDER_MESSAGE,
              )}
              value={filter.placeId}
            />
          </Col>
        )}
        <Col xs={colSize}>
          <Select
            autoBlur
            clearable
            onChange={this.handleCashierChange}
            options={createSelectOptions(cashiers, formatCashierLabel)}
            placeholder={i18next.t(
              LOCALIZATION.FILTER_BY_CASHIER_PLACEHOLDER_MESSAGE,
            )}
            value={filter.cashierId}
          />
        </Col>
      </Row>
    );
  }
}

TransactionsFilter.propTypes = {
  loyaltyType: PropTypes.string,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  cashiers: PropTypes.array,
  users: PropTypes.array,
  places: PropTypes.array,
  rewards: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    places: getLoyaltyPlaces(state),
    cashiers: getCashiers(state),
    rewards: getPunchRewards(state),
    users: getUsers(state),
  };
}

export default connect(mapStateToProps)(TransactionsFilter);
