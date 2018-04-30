import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isBusy, hasNext, hasPrev } from '@shoutem/redux-io';
import { Paging, LoaderContainer } from '@shoutem/react-web-ui';
import { Table } from 'src/components';
import {
  getDealStats,
  loadNextPage,
  loadPreviousPage,
 } from '../../redux';
import { DealStatsRow } from '../../components';
import './style.scss';

const DEAL_STATS_HEADER = [
  {
    id: 'deal',
    value: 'Title',
    className: 'deal-stats__deal',
  },
  {
    id: 'place',
    value: 'Place',
    className: 'deal-stats__place',
  },
  {
    id: 'start',
    value: 'Start',
    className: 'deal-stats__start',
  },
  {
    id: 'end',
    value: 'End',
    className: 'deal-stats__end',
  },
  {
    id: 'total',
    value: 'Total coupons',
    className: 'deal-stats__total',
  },
  {
    id: 'claimed',
    value: 'Claimed coupons',
    className: 'deal-stats__stat',
  },
  {
    id: 'remaining',
    value: 'Remaining coupons',
    className: 'deal-stats__stat',
  },
  {
    id: 'redeemed',
    value: 'Redeemed coupons',
    className: 'deal-stats__stat',
  },
];

export class DealStatsDashboard extends Component {
  static propTypes = {
    dealStats: PropTypes.array,
    selectedDealId: PropTypes.string,
    onSelectedDealChange: PropTypes.func,
    loadPreviousPage: PropTypes.func,
    loadNextPage: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.renderDealStatRow = this.renderDealStatRow.bind(this);
  }

  handleNextPageClick() {
    const { dealStats } = this.props;
    this.props.loadNextPage(dealStats);
  }

  handlePreviousPageClick() {
    const { dealStats } = this.props;
    this.props.loadPreviousPage(dealStats);
  }

  renderDealStatRow(dealStat) {
    const { selectedDealId, onSelectedDealChange } = this.props;
    const { id } = dealStat;

    return (
      <DealStatsRow
        dealStat={dealStat}
        isSelected={selectedDealId === id}
        key={id}
        onDealSelect={onSelectedDealChange}
      />
    );
  }

  render() {
    const { dealStats } = this.props;

    return (
      <LoaderContainer
        className="deal-stats-dashboard"
        isLoading={isBusy(dealStats)}
        isOverlay
      >
        <Table
          className="deal-stats-table"
          columnHeaders={DEAL_STATS_HEADER}
          emptyPlaceholderText="There are no deals satisfying current filter"
          items={dealStats}
          renderItem={this.renderDealStatRow}
        />
        <Paging
          hasNext={hasNext(dealStats)}
          hasPrevious={hasPrev(dealStats)}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
        />
      </LoaderContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    dealStats: getDealStats(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadNextPage: (dealStats) => (
      dispatch(loadNextPage(dealStats))
    ),
    loadPreviousPage: (dealStats) => (
      dispatch(loadPreviousPage(dealStats))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DealStatsDashboard);
