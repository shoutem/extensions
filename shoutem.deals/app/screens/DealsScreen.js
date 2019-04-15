import _ from 'lodash';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  InteractionManager,
} from 'react-native';

import { navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Text,
  View,
} from '@shoutem/ui';

import { CmsListScreen } from 'shoutem.cms';
import { isFavoritesSchema } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';

import { ext, DEALS_SCHEMA, DEALS_TAG, TRANSLATIONS } from '../const';

import {
  fetchDealTransactions,
  fetchDealListTransactions,
  getCatalogId,
} from '../redux';

// Components
import DealGridView from '../components/DealGridView';
import MyDealsBadge from '../components/MyDealsBadge';
import DealsMap from '../components/DealsMap';
import FeaturedDealView from '../components/FeaturedDealView';

export class DealsScreen extends CmsListScreen {

  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: PropTypes.func,
    hasFavorites: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.handleOpenDealDetails = this.handleOpenDealDetails.bind(this);
    this.handleOpenMyDeals = this.handleOpenMyDeals.bind(this);
    this.handleToggleMap = this.handleToggleMap.bind(this);

    this.state = {
      ...this.state,
      schema: DEALS_SCHEMA,
      renderMap: false,
    };

    this.props.fetchDealTransactions(this.props.catalogId);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
  }

  /**
   * Getter methods
   */

  getNavBarProps(screenTitle = I18n.t(TRANSLATIONS.DEALS_LIST_BUTTON)) {
    const navBarProps = super.getNavBarProps();

    navBarProps.renderRightComponent = () => {
      const { renderMap } = this.state;

      return (
        <View virtual styleName="container">
          <MyDealsBadge onPress={this.handleOpenMyDeals} />

          <Button styleName="clear md-gutter-left" onPress={this.handleToggleMap}>
            <Text>{renderMap ? screenTitle : I18n.t(TRANSLATIONS.DEALS_MAP_BUTTON)}</Text>
          </Button>
        </View>
      );
    };

    return navBarProps;
  }

  getNextDeal(deal) {
    const { data } = this.props;
    const currentArticleIndex = _.findIndex(data, { id: deal.id });
    return data[currentArticleIndex + 1];
  }

  getPreviousDeal(deal) {
    const { data } = this.props;
    const currentArticleIndex = _.findIndex(data, { id: deal.id });
    return data[currentArticleIndex - 1];
  }

  getQueryParams(options) {
    const queryParams = super.getQueryParams(options);
    const todayStr = new Date().toISOString();

    return {
      ...queryParams,
      'filter[available]': 1,
      'filter[publishTime][lt]': todayStr,
      'filter[endTime][gt]': todayStr,
    };
  }

  /**
   * Fetch data methods
   */

  fetchData(options) {
    const {
      catalogId,
      find,
    } = this.props;
    const { schema } = this.state;

    InteractionManager.runAfterInteractions(() =>
      find(schema, undefined, {
        query: { ...this.getQueryParams(options) },
      }).then(({ payload }) => {
        if (!payload || !payload.data) {
          return;
        }

        const dealIdList = _.map(payload.data, 'id');
        if (!_.isEmpty(dealIdList)) {
          this.props.fetchDealListTransactions(catalogId, dealIdList);
        }
      }),
    );
  }

  loadMore() {
    const { catalogId } = this.props;

    this.props.next(this.props.data).then(action => {
      if (!action.payload || !action.payload.data) {
        return;
      }

      const dealIdList = _.map(action.payload.data, 'id');
      if (!_.isEmpty(dealIdList)) {
        this.props.fetchDealListTransactions(catalogId, dealIdList);
      }
    });
  }

  /**
   * Handler methods
   */

  handleOpenDealDetails(deal) {
    this.props.navigateTo({
      screen: ext('LargeDealDetailsScreen'),
      props: {
        deal,
        nextDeal: this.getNextDeal(deal),
        previousDeal: this.getPreviousDeal(deal),
        onOpenDealDetails: this.handleOpenDealDetails,
        hasFavoriteButton: this.props.hasFavorites,
      },
    });
  }

  handleOpenMyDeals() {
    this.props.navigateTo({
      screen: ext('MyDealsScreen'),
      props: {
        catalogId: this.props.catalogId,
        onOpenDealDetails: this.handleOpenDealDetails,
      },
    });
  }

  handleToggleMap() {
    this.setState(prevState => ({
      renderMap: !prevState.renderMap,
    }));
  }

  renderFeaturedDeal(deal) {
    return (
      <FeaturedDealView
        deal={deal}
        onPress={this.handleOpenDealDetails}
      />
    );
  }

  /**
   * Render methods
   */

  renderMap() {
    const { renderMap } = this.state;

    if (!renderMap) {
      return null;
    }

    return (
      <DealsMap
        data={this.props.data}
        style={this.props.style}
        onOpenDealDetails={this.handleOpenDealDetails}
      />
    );
  }

  renderRow(deal) {
    return (
      <DealGridView
        key={deal.id}
        deal={deal}
        onPress={this.handleOpenDealDetails}
      />
    );
  }

  renderData(deals) {
    const { renderMap } = this.state;
    if (renderMap) {
      return this.renderMap();
    }

    return super.renderData(deals);
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = ownProps;
  return {
    ...CmsListScreen.createMapStateToProps(state => state[ext()][DEALS_TAG])(state, ownProps),
    catalogId: getCatalogId(shortcut),
    hasFavorites: isFavoritesSchema(state, DEALS_SCHEMA),
  };
};

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  fetchDealTransactions,
  fetchDealListTransactions,
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('DealsScreen', {}))(DealsScreen),
);
