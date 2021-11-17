import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from '@shoutem/cms-dashboard';
import { Paging, LoaderContainer } from '@shoutem/react-web-ui';
import { isBusy, hasNext, hasPrev } from '@shoutem/redux-io';
import { DealStatsRow } from '../../components';
import { getDealStats, loadNextPage, loadPreviousPage } from '../../redux';
import LOCALIZATION from './localization';
import './style.scss';

function getColumnHeaders() {
  return [
    {
      id: 'deal',
      value: i18next.t(LOCALIZATION.HEADER_TITLE_TITLE),
      className: 'deal-stats__deal',
    },
    {
      id: 'place',
      value: i18next.t(LOCALIZATION.HEADER_PLACE_TITLE),
      className: 'deal-stats__place',
    },
    {
      id: 'start',
      value: i18next.t(LOCALIZATION.HEADER_START_TITLE),
      className: 'deal-stats__start',
    },
    {
      id: 'end',
      value: i18next.t(LOCALIZATION.HEADER_END_TITLE),
      className: 'deal-stats__end',
    },
    {
      id: 'total',
      value: i18next.t(LOCALIZATION.HEADER_TOTAL_COUPONS_TITLE),
      className: 'deal-stats__total',
    },
    {
      id: 'claimed',
      value: i18next.t(LOCALIZATION.HEADER_CLAIMED_COUPONS_TITLE),
      className: 'deal-stats__stat',
    },
    {
      id: 'remaining',
      value: i18next.t(LOCALIZATION.HEADER_REMAINING_COUPONS_TITLE),
      className: 'deal-stats__stat',
    },
    {
      id: 'redeemed',
      value: i18next.t(LOCALIZATION.HEADER_REDEEMED_COUPONS_TITLE),
      className: 'deal-stats__stat',
    },
  ];
}

export class DealStatsDashboard extends PureComponent {
  static propTypes = {
    dealStats: PropTypes.array,
    selectedDealId: PropTypes.string,
    onSelectedDealChange: PropTypes.func,
    loadPreviousPage: PropTypes.func,
    loadNextPage: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  handleNextPageClick() {
    const { dealStats, loadNextPage } = this.props;

    loadNextPage(dealStats);
  }

  handlePreviousPageClick() {
    const { dealStats, loadPreviousPage } = this.props;

    loadPreviousPage(dealStats);
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
          columnHeaders={getColumnHeaders()}
          emptyPlaceholderText={i18next.t(
            LOCALIZATION.TABLE_EMPTY_PLACEHOLDER_MESSAGE,
          )}
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
    loadNextPage: dealStats => dispatch(loadNextPage(dealStats)),
    loadPreviousPage: dealStats => dispatch(loadPreviousPage(dealStats)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DealStatsDashboard);
