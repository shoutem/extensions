import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SearchInput, LoaderContainer } from '@shoutem/react-web-ui';
import { shouldLoad, shouldRefresh, isInitialized } from '@shoutem/redux-io';
import { dealsApi } from 'src/services';
import {
  getDealStats,
  getTransactionStats,
  loadDealStats,
  loadTransactionStats,
  invalidateStats,
  DealStatsDashboard,
  TransactionStatsDashboard,
  DealStatsFilter,
} from 'src/modules/stats';
import LOCALIZATION from './localization';
import './style.scss';

export class DealsStatisticsPage extends PureComponent {
  static propTypes = {
    dealStats: PropTypes.array,
    transactionStats: PropTypes.array,
    fetchShortcuts: PropTypes.func,
    loadDealStats: PropTypes.func,
    loadTransactionStats: PropTypes.func,
    invalidateStats: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    const { extension } = props;
    const dealsEndpoint = _.get(extension, 'settings.services.core.deals');

    dealsApi.init(dealsEndpoint);

    this.state = {
      filter: {},
      selectedDeal: null,
    };
  }

  componentDidMount() {
    this.refreshData(this.props, true);
  }

  componentDidUpdate(prevProps) {
    this.refreshData(prevProps);
  }

  refreshData(prevProps, forceLoading) {
    const { transactionStats } = this.props;
    const { filter, selectedDeal } = this.state;

    if (shouldLoad(this.props, prevProps, 'dealStats') || forceLoading) {
      const { loadDealStats } = this.props;

      loadDealStats(filter);
    }

    if (selectedDeal && shouldRefresh(transactionStats)) {
      this.loadTransactionStats();
    }
  }

  loadTransactionStats() {
    const { loadTransactionStats } = this.props;
    const { selectedDeal, filter } = this.state;
    const { id, catalog } = selectedDeal;

    loadTransactionStats(catalog, id, filter);
  }

  handleSearchTermChange(searchTerm) {
    const { invalidateStats } = this.props;
    const { filter } = this.state;

    this.setState(
      {
        selectedDeal: null,
        filter: {
          ...filter,
          searchTerm: searchTerm.value,
        },
      },
      invalidateStats,
    );
  }

  handleDateFilterChange(startTime, endTime) {
    const { invalidateStats } = this.props;
    const { filter } = this.state;

    this.setState(
      {
        filter: {
          ...filter,
          startTime,
          endTime,
        },
      },
      invalidateStats,
    );
  }

  handleSelectedDealChange(selectedDeal) {
    this.setState({ selectedDeal }, this.loadTransactionStats);
  }

  handleClearDealSelection() {
    this.setState({ selectedDeal: null });
  }

  render() {
    const { dealStats } = this.props;
    const { filter, selectedDeal } = this.state;

    const selectedDealId = _.get(selectedDeal, 'id');
    const selectedDealTitle = _.get(selectedDeal, 'title');

    return (
      <LoaderContainer
        className="deal-stats-page settings-page is-wide"
        isLoading={!isInitialized(dealStats)}
      >
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <SearchInput
          className="deal-stats-page__search"
          onChange={this.handleSearchTermChange}
          placeholder={i18next.t(LOCALIZATION.SEARCH_PLACEHOLDER_MESSAGE)}
          ref="dealsSearchInput"
          type="text"
        />
        <DealStatsFilter
          endTime={filter.endTime}
          onFilterChange={this.handleDateFilterChange}
          startTime={filter.startTime}
        />
        <DealStatsDashboard
          onSelectedDealChange={this.handleSelectedDealChange}
          selectedDealId={selectedDealId}
        />
        {selectedDeal && (
          <TransactionStatsDashboard
            onClearSelection={this.handleClearDealSelection}
            selectedDealTitle={selectedDealTitle}
          />
        )}
      </LoaderContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    dealStats: getDealStats(state),
    transactionStats: getTransactionStats(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { appId, extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadDealStats: filter => dispatch(loadDealStats(appId, filter, scope)),
    loadTransactionStats: (catalogId, dealId, filter) =>
      dispatch(loadTransactionStats(catalogId, dealId, filter, scope)),
    invalidateStats: () => dispatch(invalidateStats()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DealsStatisticsPage);
