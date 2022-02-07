import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { ConfirmModal, InlineModal, Paging } from '@shoutem/react-web-ui';
import { shouldRefresh } from '@shoutem/redux-io';
import { AddTransactionButton, TransactionsTable } from '../../components';
import {
  deleteTransaction,
  getAllCards,
  getTransactionPaginationInfo,
  getTransactions,
  getUsers,
  getUserTransactionInfos,
  loadCards,
  loadNextTransactionsPage,
  loadPreviousTransactionsPage,
  loadTransactions,
  loadUsers,
} from '../../redux';
import AddTransactionForm from '../add-transaction-form';
import LOCALIZATION from './localization';
import './style.scss';

export function TransactionsDashboard({
  appId,
  extensionName,
  selectedUserId,
  selectedCardId,
  programId,
}) {
  const dispatch = useDispatch();
  const deleteTransactionModalRef = useRef();

  const allTransactions = useSelector(getTransactions);
  const userTransactions = useSelector(state =>
    getUserTransactionInfos(state, selectedUserId),
  );
  const allCards = useSelector(getAllCards);
  const users = useSelector(getUsers);
  const { transactionCount, hasNext, hasPrev } = useSelector(state =>
    getTransactionPaginationInfo(state, userTransactions),
  );

  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    userId: selectedUserId,
    cardId: selectedCardId,
  });

  const hasChanges = useMemo(
    () =>
      currentFilter.userId !== selectedUserId &&
      currentFilter.cardId !== selectedCardId,
    [
      currentFilter.cardId,
      currentFilter.userId,
      selectedCardId,
      selectedUserId,
    ],
  );

  useEffect(() => {
    if (!programId) {
      return;
    }

    if (shouldRefresh(allTransactions) || hasChanges) {
      dispatch(loadTransactions(programId, selectedCardId, { extensionName }));
    }

    if (shouldRefresh(allCards)) {
      dispatch(loadCards(programId, { extensionName }));
    }

    if (shouldRefresh(users)) {
      dispatch(loadUsers(appId, { extensionName }));
    }

    if (hasChanges) {
      setCurrentFilter({
        userId: selectedUserId,
        cardId: selectedCardId,
      });
    }
  }, [
    appId,
    allCards,
    dispatch,
    extensionName,
    hasChanges,
    programId,
    selectedCardId,
    selectedUserId,
    allTransactions,
    users,
  ]);

  function handleNextPageClick() {
    return dispatch(loadNextTransactionsPage(userTransactions));
  }

  function handlePreviousPageClick() {
    return dispatch(loadPreviousTransactionsPage(userTransactions));
  }

  function handleShowTransactionModal() {
    setTransactionModalVisible(true);
  }

  function handleHideTransactionModal() {
    setTransactionModalVisible(false);
  }

  function handleDeleteTransactionClick(transactionId) {
    deleteTransactionModalRef.current.show({
      title: i18next.t(
        LOCALIZATION.TRANSACTIONS_DASHBOARD_DELETE_TRANSACTION_TITLE,
      ),
      message: i18next.t(
        LOCALIZATION.TRANSACTIONS_DASHBOARD_DELETE_TRANSACTION_MESSAGE,
      ),
      confirmLabel: i18next.t(
        LOCALIZATION.TRANSACTIONS_DASHBOARD_DELETE_TRANSACTION_BUTTON_CONFIRM_TITLE,
      ),
      confirmBsStyle: 'danger',
      abortLabel: i18next.t(
        LOCALIZATION.TRANSACTIONS_DASHBOARD_DELETE_TRANSACTION_BUTTON_ABORT_TITLE,
      ),
      onConfirm: () => dispatch(deleteTransaction(transactionId, programId)),
    });
  }

  return (
    <>
      <h3>{i18next.t(LOCALIZATION.TRANSACTIONS_DASHBOARD_TITLE)}</h3>
      <AddTransactionButton onClick={handleShowTransactionModal} />
      <TransactionsTable
        onDeleteClick={handleDeleteTransactionClick}
        transactionInfos={userTransactions}
      />
      <Paging
        hasNext={hasNext}
        hasPrev={hasPrev}
        itemCount={transactionCount}
        onNextPageClick={handleNextPageClick}
        onPreviousPageClick={handlePreviousPageClick}
      />
      {transactionModalVisible && (
        <InlineModal
          className="add-transaction-modal settings-page-modal"
          onHide={handleHideTransactionModal}
          title={i18next.t(LOCALIZATION.TRANSACTIONS_DASHBOARD_MODAL_TITLE)}
        >
          <AddTransactionForm
            programId={programId}
            onModalDismiss={handleHideTransactionModal}
          />
        </InlineModal>
      )}
      <ConfirmModal
        className="settings-page-modal"
        ref={deleteTransactionModalRef}
      />
    </>
  );
}

TransactionsDashboard.propTypes = {
  appId: PropTypes.string.isRequired,
  extensionName: PropTypes.string.isRequired,
  programId: PropTypes.string.isRequired,
  selectedCardId: PropTypes.string,
  selectedUserId: PropTypes.string,
};

TransactionsDashboard.defaultProps = {
  selectedCardId: null,
  selectedUserId: null,
};

export default TransactionsDashboard;
