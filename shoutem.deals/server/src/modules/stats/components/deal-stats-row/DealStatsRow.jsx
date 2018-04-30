import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { DISPLAY_DATE_FORMAT, DISPLAY_TIME_FORMAT } from 'src/const';
import './style.scss';

const dateFormat = `${DISPLAY_DATE_FORMAT} ${DISPLAY_TIME_FORMAT}`;

function getDealStat(deal, stat, showUnlimited) {
  const { couponsEnabled, couponsLimited } = deal;
  const statValue = _.get(deal, stat, '-');

  if (!couponsEnabled) {
    return '-';
  }

  if (couponsLimited) {
    return statValue;
  }

  return showUnlimited ? 'unlimited' : statValue;
}

export default class DealStatsRow extends Component {
  static propTypes = {
    dealStat: PropTypes.object,
    isSelected: PropTypes.bool,
    onDealSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleDealSelect = this.handleDealSelect.bind(this);
  }

  handleDealSelect() {
    const { dealStat, onDealSelect } = this.props;
    onDealSelect(dealStat);
  }

  render() {
    const { isSelected, dealStat } = this.props;
    const { title, place, startTime, endTime } = dealStat;

    const classes = classNames('deals-stats-table-row', {
      'is-selected': isSelected,
    });

    const startLabel = moment(startTime).format(dateFormat);
    const endLabel = moment(endTime).format(dateFormat);

    return (
      <tr
        className={classes}
        onClick={this.handleDealSelect}
      >
        <td>{title}</td>
        <td>{_.get(place, 'name')}</td>
        <td>{startLabel}</td>
        <td>{endLabel}</td>
        <td className="deal-stats-table-row__stat">
          {getDealStat(dealStat, 'totalCoupons', true)}
        </td>
        <td className="deal-stats-table-row__stat">
          {getDealStat(dealStat, 'claimedCoupons')}
        </td>
        <td className="deal-stats-table-row__stat">
          {getDealStat(dealStat, 'remainingCoupons', true)}
        </td>
        <td className="deal-stats-table-row__stat">
          {getDealStat(dealStat, 'redeemedCoupons')}
        </td>
      </tr>
    );
  }
}
