import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InteractionManager } from 'react-native';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Text,
  Title,
  View,
} from '@shoutem/ui';

import { CmsListScreen } from 'shoutem.cms';
import { isFavoritesSchema } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';

import DealGridView from '../components/DealGridView';
import DealsMap from '../components/DealsMap';
import FeaturedDealView from '../components/FeaturedDealView';
import MyDealsBadge from '../components/MyDealsBadge';
import { ext, DEALS_SCHEMA, DEALS_TAG, TRANSLATIONS } from '../const';
import {
  fetchDealTransactions,
  fetchDealListTransactions,
  getCatalogId,
} from '../redux';

export class DealsScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: PropTypes.func,
    hasFavorites: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: DEALS_SCHEMA,
      renderMap: false,
    };

    this.props.fetchDealTransactions(this.props.catalogId);
  }

  /**
   * Getter methods
   */

  getNavBarProps(screenTitle = I18n.t(TRANSLATIONS.DEALS_LIST_BUTTON), titleStyle = {}) {
    const navBarProps = super.getNavBarProps();

    navBarProps.renderRightComponent = () => {
      const { renderMap } = this.state;

      return (
        <View styleName="container" virtual>
          <MyDealsBadge onPress={this.handleOpenMyDeals} />

          <Button onPress={this.handleToggleMap} styleName="clear">
            <Text>{renderMap ? screenTitle : I18n.t(TRANSLATIONS.DEALS_MAP_BUTTON)}</Text>
          </Button>
        </View>
      );
    };

    navBarProps.renderTitleComponent = () => {
      const value = navBarProps.title;

      return (
        <View style={titleStyle} styleName="container" virtual>
          <Title animationName={navBarProps.animationName} numberOfLines={1} >
            {value || ''}
          </Title>
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
    // Deals currently can't assign channels for languages properly,
    // so we're excluding this filter for the time being
    // Improvement task in https://fiveminutes.jira.com/browse/SEEXT-8899

    const queryParams = _.omit(super.getQueryParams(options), ['filter[channels]']);
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

    InteractionManager.runAfterInteractions(() => find(schema, undefined, {
      query: { ...this.getQueryParams(options) },
    }).then(({ payload }) => {
      if (!payload || !payload.data) {
        return;
      }

      const dealIdList = _.map(payload.data, 'id');
      if (!_.isEmpty(dealIdList)) {
        this.props.fetchDealListTransactions(catalogId, dealIdList);
      }
    }));
  }

  loadMore() {
    const { catalogId } = this.props;

    this.props.next(this.props.data).then((action) => {
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
        onOpenDealDetails={this.handleOpenDealDetails}
        style={this.props.style}
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
