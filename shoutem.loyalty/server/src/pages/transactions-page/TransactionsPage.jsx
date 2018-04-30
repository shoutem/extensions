import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import { getProgramId, initializeApiEndpoints } from 'src/services';
import { getCashiers, loadCashiers } from 'src/modules/cashiers';
import {
  LoyaltyTypeRadioGroup,
  TransactionsDashboard,
  TransactionsFilter,
  getTransactions,
  getGeneralStats,
  loadTransactions,
  loadGeneralStats,
} from 'src/modules/transactions';
import {
  getPunchRewards,
  loadPunchRewards,
} from 'src/modules/punch-rewards';
import {
  getLoyaltyPlaces,
  getCardsByUserId,
  getUsers,
  loadLoyaltyPlaces,
  loadCards,
  loadUsers,
} from 'src/modules/program';
import { LOYALTY_TYPES } from 'src/const';
import './style.scss';

export class TransactionsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.loadTransactionStats = this.loadTransactionStats.bind(this);
    this.handleLoyaltyTypeChange = this.handleLoyaltyTypeChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);

    const { extension: { settings } } = props;
    initializeApiEndpoints(settings);

    const programId = getProgramId(settings);
    this.state = {
      programId,
      loyaltyType: LOYALTY_TYPES.POINTS,
      filter: {},
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { programId } = this.state;
    const { appId } = nextProps;

    if (!programId) {
      return;
    }

    if (shouldLoad(nextProps, props, 'transactions')) {
      this.loadTransactionStats();
    }

    if (shouldLoad(nextProps, props, 'cashiers')) {
      this.props.loadCashiers(programId);
    }

    if (shouldLoad(nextProps, props, 'places')) {
      this.props.loadPlaces(appId);
    }

    if (shouldLoad(nextProps, props, 'cardsByUserId')) {
      this.props.loadCards(programId);
    }

    if (shouldLoad(nextProps, props, 'punchRewards')) {
      this.props.loadPunchRewards(programId, appId);
    }

    if (shouldLoad(nextProps, props, 'users')) {
      this.props.loadUsers(appId);
    }
  }

  loadTransactionStats() {
    const { cardsByUserId } = this.props;
    const { programId, loyaltyType, filter } = this.state;

    const { userId, ...otherProps } = filter;

    // If user doesn't have a card, we cannot send empty filter because
    // loyalty-manager will return transactions for all cards in that case
    const cardId = userId && _.get(cardsByUserId, [userId, 'id'], 'null');

    const loyaltyFilter = {
      cardId,
      ...otherProps,
    };

    this.props.loadTransactions(programId, loyaltyType, loyaltyFilter);
    this.props.loadGeneralStats(programId, loyaltyType, loyaltyFilter);
  }

  handleLoyaltyTypeChange(loyaltyType) {
    const { filter } = this.state;

    // We want to save common filter props that are shared through all loyalty types
    const newFilter = _.pick(filter, ['userId', 'cashierId']);
    this.setState({ loyaltyType, filter: newFilter }, this.loadTransactionStats);
  }

  handleFilterChange(filterPatch) {
    const { filter } = this.state;

    const newFilter = { ...filter, ...filterPatch };
    this.setState({ filter: newFilter }, this.loadTransactionStats);
  }

  render() {
    const {
      appId,
      ownExtensionName,
      transactions,
      generalStats,
      users,
    } = this.props;

    const {
      programId,
      loyaltyType,
      filter,
    } = this.state;

    const dataInitialized = (
      isInitialized(transactions) &&
      isInitialized(generalStats) &&
      isInitialized(users)
    );

    return (
      <LoaderContainer
        className="transactions-page settings-page is-wide"
        isLoading={programId && !dataInitialized}
      >
        <LoyaltyTypeRadioGroup
          loyaltyType={loyaltyType}
          onLoyaltyTypeChanged={this.handleLoyaltyTypeChange}
        />
        <h3>Transactions</h3>
        <TransactionsFilter
          filter={filter}
          loyaltyType={loyaltyType}
          onFilterChange={this.handleFilterChange}
        />
        <TransactionsDashboard
          appId={appId}
          extensionName={ownExtensionName}
          filter={filter}
          loyaltyType={loyaltyType}
          onFilterChange={this.handleFilterChange}
          programId={programId}
        />
      </LoaderContainer>
    );
  }
}

TransactionsPage.propTypes = {
  appId: PropTypes.string,
  ownExtensionName: PropTypes.string,
  extension: PropTypes.object,
  transactions: PropTypes.array,
  generalStats: PropTypes.object,
  cardsByUserId: PropTypes.object,
  users: PropTypes.array,
  cashiers: PropTypes.array,
  punchRewards: PropTypes.array,
  places: PropTypes.array,
  loadTransactions: PropTypes.func,
  loadGeneralStats: PropTypes.func,
  loadCashiers: PropTypes.func,
  loadPlaces: PropTypes.func,
  loadCards: PropTypes.func,
  loadPunchRewards: PropTypes.func,
  loadUsers: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    transactions: getTransactions(state),
    generalStats: getGeneralStats(state),
    cashiers: getCashiers(state),
    places: getLoyaltyPlaces(state),
    punchRewards: getPunchRewards(state),
    users: getUsers(state),
    cardsByUserId: getCardsByUserId(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { ownExtensionName } = ownProps;
  const scope = { extensionName: ownExtensionName };

  return {
    loadTransactions: (programId, loyaltyType, filter) => (
      dispatch(loadTransactions(programId, loyaltyType, filter, scope))
    ),
    loadGeneralStats: (programId, loyaltyType, filter) => (
      dispatch(loadGeneralStats(programId, loyaltyType, filter, scope))
    ),
    loadCashiers: (programId, placeId) => (
      dispatch(loadCashiers(programId, placeId, scope))
    ),
    loadPlaces: (appId, categoryId) => (
      dispatch(loadLoyaltyPlaces(appId, categoryId, scope))
    ),
    loadCards: (programId) => (
      dispatch(loadCards(programId, scope))
    ),
    loadPunchRewards: (programId, appId) => (
      dispatch(loadPunchRewards(programId, appId, scope))
    ),
    loadUsers: (appId) => (
      dispatch(loadUsers(appId, scope))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage);
