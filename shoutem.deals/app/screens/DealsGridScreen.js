import _ from 'lodash';

import React from 'react';
import { connect } from 'react-redux';

import { cloneStatus } from '@shoutem/redux-io';
import { GridRow, View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import { ext, TRANSLATIONS } from '../const';

// Components
import {
  DealsScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './DealsScreen';
import DealGridView from '../components/DealGridView';

export class DealsGridScreen extends DealsScreen {

  constructor(props, context) {
    super(props, context);

    this.handleOpenDealDetails = this.handleOpenDealDetails.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      ...this.state,
      renderCategoriesInline: true,
    };
  }

  getNavBarProps() {
    return super.getNavBarProps(I18n.t(TRANSLATIONS.DEALS_GRID_BUTTON));
  }

  renderRow(deals, sectionId, dealId) {
    const { hasFeaturedItem } = this.props;

    if (hasFeaturedItem && dealId === '0') {
      return this.renderFeaturedDeal(deals[0]);
    }

    const dealsViews = _.map(deals, deal => (
      <DealGridView
        deal={deal}
        key={deal.id}
        onPress={this.handleOpenDealDetails}
      />
    ));

    return (
      <View styleName="flexible sm-gutter-bottom sm-gutter-left">
        <GridRow columns={2}>
          {dealsViews}
        </GridRow>
      </View>
    );
  }

  renderData(deals) {
    const { renderMap } = this.state;
    if (renderMap) {
      return this.renderMap();
    }

    if (_.isEmpty(deals)) {
      return super.renderData(deals);
    }

    const { hasFeaturedItem } = this.props;

    let listData = [...deals];
    let featuredDeal = null;

    if (hasFeaturedItem) {
      featuredDeal = listData.splice(0, 1);
    }

    const groupedDeals = GridRow.groupByRows(listData, 2);

    if (featuredDeal) {
      listData = [featuredDeal, ...groupedDeals];
    } else {
      listData = groupedDeals;
    }
    cloneStatus(deals, listData);

    return super.renderData(listData);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('DealsGridScreen', {}))(DealsGridScreen),
);
