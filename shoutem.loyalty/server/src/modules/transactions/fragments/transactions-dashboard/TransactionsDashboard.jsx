import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfirmModal,
  LoaderContainer,
  Paging,
} from '@shoutem/react-web-ui';
import { isBusy, invalidate } from '@shoutem/redux-io';
import { GeneralStats, TransactionsTable } from '../../components';
import { getTransactionCount } from '../../services';
import AddTransactionFragment from '../add-transaction-fragment';
import {
  getTransactionInfos,
  getGeneralStats,
  deleteTransaction,
  loadNextTransactionsPage,
  loadPreviousTransactionsPage,
  TRANSACTION_STATS,
} from '../../redux';

export class TransactionsDashboard extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteTransactionClick = this.handleDeleteTransactionClick.bind(this);
    this.handleConfirmDeleteTransaction = this.handleConfirmDeleteTransaction.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  handleDeleteTransactionClick(currentTransactionId) {
    this.refs.confirm.show({
      title: 'Delete transaction',
      message: 'This will erase the points added or deducted during the transaction. Are you sure?',
      confirmLabel: 'Delete',
      confirmBsStyle: 'danger',
      onConfirm: () => this.handleConfirmDeleteTransaction(currentTransactionId),
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
      <LoaderContainer
        isLoading={isBusy(transactionInfos)}
        isOverlay
      >
        <h4>Overall statistics</h4>
        <GeneralStats
          generalStats={generalStats}
          loyaltyType={loyaltyType}
        />
        <h4>Transactions</h4>
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
    deleteTransaction: (transactionId, programId) => (
      dispatch(deleteTransaction(transactionId, programId, scope))
        .then(() => dispatch(invalidate(TRANSACTION_STATS)))
    ),
    loadNextPage: (transactions) => (
      dispatch(loadNextTransactionsPage(transactions))
    ),
    loadPreviousPage: (transactions) => (
      dispatch(loadPreviousTransactionsPage(transactions))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsDashboard);
