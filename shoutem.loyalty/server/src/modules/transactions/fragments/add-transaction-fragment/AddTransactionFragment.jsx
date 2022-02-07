import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LOYALTY_TYPES } from 'src/const';
import { getCashiers } from 'src/modules/cashiers';
import {
  createCard,
  getCardsByUserId,
  getLoyaltyPlaces,
  getUsers,
} from 'src/modules/program';
import { getPunchRewards } from 'src/modules/punch-rewards';
import { createSelectOptions } from 'src/services';
import { IconLabel, InlineModal } from '@shoutem/react-web-ui';
import { invalidate } from '@shoutem/redux-io';
import {
  MultiCardTransactionForm,
  PunchCardTransactionForm,
  SingleCardTransactionForm,
} from '../../components';
import { createTransaction, TRANSACTION_STATS } from '../../redux';
import {
  formatPlaceLabel,
  formatRewardLabel,
  formatUserLabel,
} from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

export class AddTransactionFragment extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

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
    const {
      user: { value: legacyUserId },
      ...otherOptions
    } = transactionOptions;

    const cardId = _.get(cards, [legacyUserId, 'id']);

    return new Promise((resolve, reject) => {
      if (cardId) {
        return this.createTransaction(cardId, otherOptions).catch(() =>
          reject({ _error: i18next.t(LOCALIZATION.UNABLE_TO_CREATE_MESSAGE) }),
        );
      }

      return this.props
        .createCard(programId, legacyUserId)
        .then(newCardId => this.createTransaction(newCardId, otherOptions))
        .catch(() =>
          reject({ _error: i18next.t(LOCALIZATION.UNABLE_TO_CREATE_MESSAGE) }),
        );
    });
  }

  createTransaction(cardId, transactionOptions) {
    const { programId } = this.props;

    const transaction = { cardId, ...transactionOptions };

    return this.props
      .createTransaction(programId, transaction)
      .then(this.handleHideTransactionModal);
  }

  renderModal() {
    const { rewards, places, users, loyaltyType, filter } = this.props;

    return (
      <InlineModal
        className="add-transaction-modal settings-page-modal"
        onHide={this.handleHideTransactionModal}
        title={i18next.t(LOCALIZATION.TITLE)}
      >
        {loyaltyType === LOYALTY_TYPES.POINTS && (
          <SingleCardTransactionForm
            initialValues={filter}
            onCancel={this.handleHideTransactionModal}
            onSubmit={this.handleAddTransaction}
            users={createSelectOptions(users, formatUserLabel, 'legacyId')}
          />
        )}
        {loyaltyType === LOYALTY_TYPES.PUNCH && (
          <PunchCardTransactionForm
            initialValues={filter}
            onCancel={this.handleHideTransactionModal}
            onSubmit={this.handleAddTransaction}
            rewards={createSelectOptions(rewards, formatRewardLabel)}
            users={createSelectOptions(users, formatUserLabel, 'legacyId')}
          />
        )}
        {loyaltyType === LOYALTY_TYPES.MULTI && (
          <MultiCardTransactionForm
            initialValues={filter}
            onCancel={this.handleHideTransactionModal}
            onSubmit={this.handleAddTransaction}
            places={createSelectOptions(places, formatPlaceLabel)}
            users={createSelectOptions(users, formatUserLabel, 'legacyId')}
          />
        )}
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
            {i18next.t(LOCALIZATION.BUTTON_ADD_TITLE)}
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
    createTransaction: (programId, transaction) =>
      dispatch(
        createTransaction(programId, transaction, appId, scope),
      ).then(() => dispatch(invalidate(TRANSACTION_STATS))),
    createCard: (programId, userId) =>
      dispatch(createCard(programId, userId, scope)).then(action =>
        _.get(action, 'payload.data.id'),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddTransactionFragment);
