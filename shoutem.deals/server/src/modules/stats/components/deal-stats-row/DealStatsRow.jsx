import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import { getDisplayDateFormat, getDisplayTimeFormat } from 'src/services';
import LOCALIZATION from './localization';
import './style.scss';

function getDealStat(deal, stat, showUnlimited) {
  const { couponsEnabled, couponsLimited } = deal;
  const statValue = _.get(deal, stat, '-');

  if (!couponsEnabled) {
    return '-';
  }

  if (couponsLimited) {
    return statValue;
  }

  return showUnlimited
    ? i18next.t(LOCALIZATION.UNLIMITED_VALUE_TITLE)
    : statValue;
}

export default class DealStatsRow extends PureComponent {
  static propTypes = {
    dealStat: PropTypes.object,
    isSelected: PropTypes.bool,
    onDealSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
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

    const dateFormat = `${getDisplayDateFormat()} ${getDisplayTimeFormat()}`;
    const startLabel = !!startTime ? moment(startTime).format(dateFormat) : '';
    const endLabel = moment(endTime).format(dateFormat);

    return (
      <tr className={classes} onClick={this.handleDealSelect}>
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
