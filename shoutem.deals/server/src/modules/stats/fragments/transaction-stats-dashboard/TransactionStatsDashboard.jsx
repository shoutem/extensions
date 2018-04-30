import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { isBusy, hasNext, hasPrev } from '@shoutem/redux-io';
import { Paging, LoaderContainer, FontIcon } from '@shoutem/react-web-ui';
import { Table } from 'src/components';
import {
  getTransactionStats,
  loadNextPage,
  loadPreviousPage,
 } from '../../redux';
import { TRANSACTION_ACTIONS } from '../../const';
import './style.scss';

const TRANSACTION_DISPLAY_TIME = 'YYYY/MM/DD HH:mm:ss';
const TRANSACTION_STATS_HEADER = [
  {
    id: 'time',
    value: 'Time',
    className: 'transaction-stats__time',
  },
  {
    id: 'user',
    value: 'User',
    className: 'transaction-stats__user',
  },
  {
    id: 'type',
    value: 'Type',
    className: 'transaction-stats__type',
  },
  {
    id: 'place',
    value: 'Place',
    className: 'transaction-stats__place',
  },
];

function getDisplayActionName(action) {
  if (action === TRANSACTION_ACTIONS.COUPON_CLAIMED) {
    return 'Coupon claimed';
  }

  if (action === TRANSACTION_ACTIONS.COUPON_REDEEMED) {
    return 'Coupon redeemed';
  }

  if (action === TRANSACTION_ACTIONS.DEAL_REDEEMED) {
    return 'Deal redeemed';
  }

  return action;
}

export class TransactionStatsDashboard extends Component {
  static propTypes = {
    transactionStats: PropTypes.array,
    selectedDealTitle: PropTypes.string,
    loadPreviousPage: PropTypes.func,
    loadNextPage: PropTypes.func,
    onClearSelection: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.renderTransactionStatRow = this.renderTransactionStatRow.bind(this);
  }

  handleNextPageClick() {
    const { transactionStats } = this.props;
    this.props.loadNextPage(transactionStats);
  }

  handlePreviousPageClick() {
    const { transactionStats } = this.props;
    this.props.loadPreviousPage(transactionStats);
  }

  renderTransactionStatRow(transactionStat) {
    const { id, createdAt, user, action, dealSnapshot } = transactionStat;
    const displayTime = moment(createdAt).format(TRANSACTION_DISPLAY_TIME);

    return (
      <tr key={id}>
        <td>{displayTime}</td>
        <td>{_.get(user, 'username')}</td>
        <td>{getDisplayActionName(action)}</td>
        <td>{_.get(dealSnapshot, 'place.name')}</td>
      </tr>
    );
  }

  render() {
    const {
      transactionStats,
      selectedDealTitle,
      onClearSelection,
    } = this.props;

    return (
      <LoaderContainer
        className="transaction-stats-dashboard"
        isLoading={isBusy(transactionStats)}
        isOverlay
      >
        <div className="transaction-stats-dashboard__title">
          <h3>Activities for {selectedDealTitle}</h3>
          <Button className="btn-icon pull-right" onClick={onClearSelection}>
            <FontIcon name="close" size="24px" />
          </Button>
        </div>
        <Table
          className="transaction-stats-table"
          columnHeaders={TRANSACTION_STATS_HEADER}
          emptyPlaceholderText="There are no transactions satisfying current filter"
          items={transactionStats}
          renderItem={this.renderTransactionStatRow}
        />
        <Paging
          hasNext={hasNext(transactionStats)}
          hasPrevious={hasPrev(transactionStats)}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
        />
      </LoaderContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    transactionStats: getTransactionStats(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadNextPage: (transactionStats) => (
      dispatch(loadNextPage(transactionStats))
    ),
    loadPreviousPage: (transactionStats) => (
      dispatch(loadPreviousPage(transactionStats))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionStatsDashboard);
