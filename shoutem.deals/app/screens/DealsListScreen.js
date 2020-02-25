import React from 'react';
import { connect } from 'react-redux';

import {
  Text,
  View,
} from 'react-native';

import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';

import _ from 'lodash';

import { ext, TRANSLATIONS } from '../const';

// Components
import {
  DealsScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './DealsScreen';
import DealListView from '../components/DealListView';

export class DealsListScreen extends DealsScreen {
  constructor(props) {
    super(props);

    this.handleOpenDealDetails = this.handleOpenDealDetails.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      ...this.state,
      renderCategoriesInline: true,
    };
  }

  getNavBarProps() {
    const titleStyle = _.get(this.props, 'style.titleContainer', {});
    return super.getNavBarProps(I18n.t(TRANSLATIONS.DEALS_LIST_BUTTON), titleStyle);
  }

  renderRow(deal, sectionId, dealId) {
    const { hasFeaturedItem } = this.props;

    if (hasFeaturedItem && dealId === '0') {
      return this.renderFeaturedDeal(deal);
    }

    return (
      <DealListView
        key={deal.id}
        deal={deal}
        onPress={this.handleOpenDealDetails}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('DealsListScreen', {}))(DealsListScreen),
);
