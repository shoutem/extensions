import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import i18next from 'i18next';
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
import LOCALIZATION from './localization';
import './style.scss';

function getColumnHeaders() {
  return [
    {
      id: 'time',
      value: i18next.t(LOCALIZATION.HEADER_TIME_TITLE),
      className: 'transaction-stats__time',
    },
    {
      id: 'user',
      value: i18next.t(LOCALIZATION.HEADER_USER_TITLE),
      className: 'transaction-stats__user',
    },
    {
      id: 'type',
      value: i18next.t(LOCALIZATION.HEADER_TYPE_TITLE),
      className: 'transaction-stats__type',
    },
    {
      id: 'place',
      value: i18next.t(LOCALIZATION.HEADER_PLACE_TITLE),
      className: 'transaction-stats__place',
    },
  ];
}

function getDisplayActionName(action) {
  if (action === TRANSACTION_ACTIONS.COUPON_CLAIMED) {
    return i18next.t(LOCALIZATION.ACTION_COUPON_CLAIMED_TITLE);
  }

  if (action === TRANSACTION_ACTIONS.COUPON_REDEEMED) {
    return i18next.t(LOCALIZATION.ACTION_COUPON_REDEEMED_TITLE);
  }

  if (action === TRANSACTION_ACTIONS.DEAL_REDEEMED) {
    return i18next.t(LOCALIZATION.ACTION_DEAL_REDEEMED_TITLE);
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
    const formatTime = i18next.t(LOCALIZATION.TRANSACTION_DISPLAY_TIME);
    const displayTime = moment(createdAt).format(formatTime);

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
          <h3>{i18next.t(LOCALIZATION.TITLE, { title: selectedDealTitle })}</h3>
          <Button className="btn-icon pull-right" onClick={onClearSelection}>
            <FontIcon name="close" size="24px" />
          </Button>
        </div>
        <Table
          className="transaction-stats-table"
          columnHeaders={getColumnHeaders()}
          emptyPlaceholderText={i18next.t(
            LOCALIZATION.TABLE_EMPTY_PLACEHOLDER_MESSAGE,
          )}
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
    loadNextPage: transactionStats => dispatch(loadNextPage(transactionStats)),
    loadPreviousPage: transactionStats =>
      dispatch(loadPreviousPage(transactionStats)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionStatsDashboard);
