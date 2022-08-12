import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import DealListView from '../components/DealListView';
import { ext, TRANSLATIONS } from '../const';
// Components
import {
  DealsScreen,
  mapDispatchToProps,
  mapStateToProps,
} from './DealsScreen';

export class DealsListScreen extends DealsScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
    };
  }

  getNavBarProps() {
    const titleStyle = _.get(this.props, 'style.titleContainer', {});
    return super.getNavBarProps(
      I18n.t(TRANSLATIONS.DEALS_LIST_BUTTON),
      titleStyle,
    );
  }

  renderRow(deal, sectionId, dealId) {
    const { screenSettings } = getRouteParams(this.props);

    if (screenSettings.hasFeaturedItem && dealId === '0') {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('DealsListScreen', {}))(DealsListScreen));
