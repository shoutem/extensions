import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { ConfirmModal, LoaderContainer, Paging } from '@shoutem/react-web-ui';
import { invalidate, isBusy } from '@shoutem/redux-io';
import { GeneralStats, TransactionsTable } from '../../components';
import {
  deleteTransaction,
  getGeneralStats,
  getTransactionInfos,
  loadNextTransactionsPage,
  loadPreviousTransactionsPage,
  TRANSACTION_STATS,
} from '../../redux';
import { getTransactionCount } from '../../services';
import AddTransactionFragment from '../add-transaction-fragment';
import LOCALIZATION from './localization';

export class TransactionsDashboard extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
  }

  handleDeleteTransactionClick(currentTransactionId) {
    this.refs.confirm.show({
      title: i18next.t(LOCALIZATION.DELETE_TRANSACTION_TITLE),
      message: i18next.t(LOCALIZATION.DELETE_TRANSACTION_MESSAGE),
      confirmLabel: i18next.t(
        LOCALIZATION.DELETE_TRANSACTION_BUTTON_CONFIRM_TITLE,
      ),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(LOCALIZATION.DELETE_TRANSACTION_BUTTON_ABORT_TITLE),
      onConfirm: () =>
        this.handleConfirmDeleteTransaction(currentTransactionId),
    });
  }

  handleConfirmDeleteTransaction(currentTransactionId) {
    const { programId } = this.props;
    return this.props.deleteTransaction(currentTransactionId, programId);
  }

  handleNextPageClick() {
    const { transactionInfos } = this.props;
    this.props.loadNextPage(transactionInfos);
  }

  handlePreviousPageClick() {
    const { transactionInfos } = this.props;
    this.props.loadPreviousPage(transactionInfos);
  }

  renderTable() {
    const {
      appId,
      filter,
      generalStats,
      extensionName,
      loyaltyType,
      programId,
      transactionInfos,
      onFilterChange,
    } = this.props;
    const transactionCount = getTransactionCount(transactionInfos);

    return (
      <LoaderContainer isLoading={isBusy(transactionInfos)} isOverlay>
        <h4>{i18next.t(LOCALIZATION.OVERALL_STATISTICS_TITLE)}</h4>
        <GeneralStats generalStats={generalStats} loyaltyType={loyaltyType} />
        <h4>{i18next.t(LOCALIZATION.TITLE)}</h4>
        <AddTransactionFragment
          appId={appId}
          extensionName={extensionName}
          filter={filter}
          loyaltyType={loyaltyType}
          programId={programId}
        />
        <TransactionsTable
          loyaltyType={loyaltyType}
          onDeleteClick={this.handleDeleteTransactionClick}
          onFilterChange={onFilterChange}
          transactionInfos={transactionInfos}
        />
        <Paging
          itemCount={transactionCount}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
        />
      </LoaderContainer>
    );
  }

  render() {
    return (
      <div className="transactions-dashboard">
        {this.renderTable()}
        <ConfirmModal ref="confirm" />
      </div>
    );
  }
}

TransactionsDashboard.propTypes = {
  appId: PropTypes.string,
  programId: PropTypes.string,
  extensionName: PropTypes.string,
  filter: PropTypes.object,
  loyaltyType: PropTypes.string,
  transactionInfos: PropTypes.array,
  generalStats: PropTypes.object,
  loadNextPage: PropTypes.func,
  loadPreviousPage: PropTypes.func,
  deleteTransaction: PropTypes.func,
  onFilterChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    transactionInfos: getTransactionInfos(state),
    generalStats: getGeneralStats(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    deleteTransaction: (transactionId, programId) =>
      dispatch(deleteTransaction(transactionId, programId, scope)).then(() =>
        dispatch(invalidate(TRANSACTION_STATS)),
      ),
    loadNextPage: transactions =>
      dispatch(loadNextTransactionsPage(transactions)),
    loadPreviousPage: transactions =>
      dispatch(loadPreviousTransactionsPage(transactions)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionsDashboard);
