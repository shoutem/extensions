import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import { LOYALTY_TYPES } from 'src/const';
import { createSelectOptions } from 'src/services';
import { getLoyaltyPlaces, getUsers } from 'src/modules/program';
import { getCashiers } from 'src/modules/cashiers';
import { getPunchRewards } from 'src/modules/punch-rewards';
import {
  formatUserLabel,
  formatRewardLabel,
  formatPlaceLabel,
  formatCashierLabel,
} from '../../services';
import './style.scss';

export class TransactionsFilter extends Component {
  constructor(props) {
    super(props);

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
    this.handleCashierChange = this.handleCashierChange.bind(this);
    this.handleRewardChange = this.handleRewardChange.bind(this);
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
            placeholder="Filter by user"
            value={filter.userId}
          />
        </Col>
        {loyaltyType === LOYALTY_TYPES.PUNCH &&
          <Col xs={colSize}>
            <Select
              autoBlur
              clearable
              onChange={this.handleRewardChange}
              options={createSelectOptions(rewards, formatRewardLabel)}
              placeholder="Filter by card"
              value={filter.rewardId}
            />
          </Col>
        }
        {loyaltyType === LOYALTY_TYPES.MULTI &&
          <Col xs={colSize}>
            <Select
              autoBlur
              clearable
              onChange={this.handlePlaceChange}
              options={createSelectOptions(places, formatPlaceLabel)}
              placeholder="Filter by place"
              value={filter.placeId}
            />
          </Col>
        }
        <Col xs={colSize}>
          <Select
            autoBlur
            clearable
            onChange={this.handleCashierChange}
            options={createSelectOptions(cashiers, formatCashierLabel)}
            placeholder="Filter by cashier"
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
