import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {
  cloneStatus,
  getCollection,
  isBusy,
  isError,
  isInitialized,
} from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { GridRow, ListView, View } from '@shoutem/ui';
import { EmptyStateView } from '@shoutem/ui-addons';
import { CmsListScreen } from 'shoutem.cms';
import { getFavoriteItems, fetchFavoritesData } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';

import { ext, DEALS_SCHEMA } from '../../const';
import {
  fetchDealListTransactions,
  getFavoriteDeals,
} from '../../redux';
import DealGridView from '../DealGridView';

export class FavoriteDealsList extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    catalogId: PropTypes.string,
    favorites: PropTypes.object.isRequired,
    fetchDealListTransactions: PropTypes.func,
    fetchFavoritesData: PropTypes.func,
    onOpenDealDetails: PropTypes.func,
    navigateTo: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.renderData = this.renderData.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      schema: DEALS_SCHEMA,
      isLoading: false,
    };
  }

  componentDidMount() {
    const { favorites } = this.props;
    this.fetchFavoriteDeals(favorites);
  }

  componentWillReceiveProps(newProps) {
    const { favorites } = this.props;

    if (newProps.favorites !== favorites) {
      this.fetchFavoriteDeals(newProps.favorites);
    }
  }

  fetchFavoriteDeals(favorites) {
    this.setState({
      isLoading: true,
    });

    this.props.fetchFavoritesData(
      this.state.schema,
      favorites[this.state.schema],
    ).then(({ payload }) => {
      const data = _.get(payload, 'data', []);
      this.fetchFavoriteDealTransactions(data);
    }).catch(() => this.setState({ isLoading: false }));
  }

  fetchFavoriteDealTransactions(deals) {
    const { catalogId } = this.props;
    const dealIdList = _.map(deals, 'id');

    this.setState({
      isLoading: true,
    });

    if (!_.isEmpty(dealIdList)) {
      this.props.fetchDealListTransactions(catalogId, dealIdList)
        .then(() => this.setState({ isLoading: false }))
        .catch(() => this.setState({ isLoading: false }));
    }
  }

  isCollectionValid(collection) {
    const { isLoading } = this.state;

    if (!isInitialized(collection) || isBusy(collection) || isLoading) {
      // The collection is loading, treat it as valid for now
      return true;
    }

    if (this.state.isLoading) {
      return false;
    }

    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  renderPlaceholderView() {
    const { data } = this.props;

    const message = isError(data)
      ? I18n.t('shoutem.application.unexpectedError')
      : I18n.t('shoutem.application.preview.noContentErrorMessage');

    return (
      <EmptyStateView icon="deals" message={message} />
    );
  }

  renderRow(deals) {
    const dealsViews = _.map(deals, deal => (
      <DealGridView
        deal={deal}
        key={deal.id}
        onPress={this.props.onOpenDealDetails}
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
    const { isLoading } = this.state;

    const groupedDeals = GridRow.groupByRows(deals, 2);
    cloneStatus(deals, groupedDeals);

    const loading = isBusy(groupedDeals) || !isInitialized(groupedDeals) || isLoading;

    return (
      <ListView
        data={groupedDeals}
        loading={loading}
        renderRow={this.renderRow}
        initialListSize={1}
      />
    );
  }

  render() {
    if (!this.isCollectionValid(this.props.data)) {
      return this.renderPlaceholderView();
    }

    return (
      <View key="favorite-deals-list">
        {this.renderData(this.props.data)}
      </View>
    );
  }

}

export const mapStateToProps = state => {
  return {
    favorites: getFavoriteItems(state),
    data: getCollection(getFavoriteDeals(state), state),
  };
};

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  fetchDealListTransactions,
  fetchFavoritesData,
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('FavoriteDealsList'), {})(FavoriteDealsList),
);
