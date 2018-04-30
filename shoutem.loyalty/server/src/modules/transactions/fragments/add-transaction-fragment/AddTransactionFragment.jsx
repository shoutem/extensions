import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { invalidate } from '@shoutem/redux-io';
import { IconLabel, InlineModal } from '@shoutem/react-web-ui';
import { createSelectOptions } from 'src/services';
import {
  getLoyaltyPlaces,
  getUsers,
  getCardsByUserId,
  createCard,
} from 'src/modules/program';
import { getCashiers } from 'src/modules/cashiers';
import { getPunchRewards } from 'src/modules/punch-rewards';
import { createTransaction, TRANSACTION_STATS } from '../../redux';
import {
  formatRewardLabel,
  formatPlaceLabel,
  formatUserLabel,
} from '../../services';
import { TransactionForm } from '../../components';
import './style.scss';

export class AddTransactionFragment extends Component {
  constructor(props) {
    super(props);

    this.handleShowTransactionModal = this.handleShowTransactionModal.bind(this);
    this.handleHideTransactionModal = this.handleHideTransactionModal.bind(this);
    this.handleAddTransaction = this.handleAddTransaction.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
    this.renderModal = this.renderModal.bind(this);

    this.state = {
      showTransactionModal: false,
    };
  }

  handleShowTransactionModal() {
    this.setState({ showTransactionModal: true });
  }

  handleHideTransactionModal() {
    this.setState({ showTransactionModal: false });
  }

  handleAddTransaction(transactionOptions) {
    const { programId, cards } = this.props;
    const { userId, ...otherOptions } = transactionOptions;

    const cardId = _.get(cards, [userId, 'id']);

    return new Promise((resolve, reject) => {
      if (cardId) {
        return this.createTransaction(cardId, otherOptions)
          .catch(() => reject({ _error: 'Unable to create transaction.' }));
      }

      return this.props.createCard(programId, userId)
        .then(newCardId => this.createTransaction(newCardId, otherOptions))
        .catch(() => reject({ _error: 'Unable to create transaction.' }));
    });
  }

  createTransaction(cardId, transactionOptions) {
    const { programId } = this.props;

    const transaction = { cardId, ...transactionOptions };
    return this.props.createTransaction(programId, transaction)
      .then(this.handleHideTransactionModal);
  }

  renderModal() {
    const {
      rewards,
      places,
      users,
      loyaltyType,
      filter,
    } = this.props;

    return (
      <InlineModal
        className="add-transaction-modal settings-page-modal"
        onHide={this.handleHideTransactionModal}
        title="Add transaction"
      >
        <TransactionForm
          initialValues={filter}
          loyaltyType={loyaltyType}
          onCancel={this.handleHideTransactionModal}
          onSubmit={this.handleAddTransaction}
          places={createSelectOptions(places, formatPlaceLabel)}
          rewards={createSelectOptions(rewards, formatRewardLabel)}
          users={createSelectOptions(users, formatUserLabel, 'legacyId')}
        />
      </InlineModal>
    );
  }

  render() {
    const { showTransactionModal } = this.state;

    return (
      <div className="add-transaction-fragment">
        <Button
          className="btn-icon pull-right"
          onClick={this.handleShowTransactionModal}
        >
          <IconLabel iconName="add">
            Add transaction
          </IconLabel>
        </Button>
        {showTransactionModal && this.renderModal()}
      </div>
    );
  }
}

AddTransactionFragment.propTypes = {
  appId: PropTypes.string,
  programId: PropTypes.string,
  loyaltyType: PropTypes.string,
  filter: PropTypes.object,
  users: PropTypes.array,
  cards: PropTypes.object,
  rewards: PropTypes.array,
  places: PropTypes.array,
  createTransaction: PropTypes.func,
  createCard: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    places: getLoyaltyPlaces(state),
    cashiers: getCashiers(state),
    rewards: getPunchRewards(state),
    users: getUsers(state),
    cards: getCardsByUserId(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName, appId } = ownProps;
  const scope = { extensionName };

  return {
    createTransaction: (programId, transaction) => (
      dispatch(createTransaction(programId, transaction, appId, scope))
        .then(() => dispatch(invalidate(TRANSACTION_STATS)))
    ),
    createCard: (programId, userId) => (
      dispatch(createCard(programId, userId, scope))
        .then(action => _.get(action, 'payload.data.id'))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTransactionFragment);
