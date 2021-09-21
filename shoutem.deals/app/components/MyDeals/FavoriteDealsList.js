import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  cloneStatus,
  getCollection,
  isBusy,
  isError,
  isInitialized,
} from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, ListView, View, EmptyStateView } from '@shoutem/ui';
import { CmsListScreen } from 'shoutem.cms';
import { getFavoriteItems, fetchFavoritesData } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { fetchDealListTransactions, getFavoriteDeals } from '../../redux';
import { ext, DEALS_SCHEMA } from '../../const';
import DealGridView from '../DealGridView';

export class FavoriteDealsList extends PureComponent {
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

    autoBindReact(this);
  }

  componentDidMount() {
    const { favorites } = this.props;

    this.fetchFavoriteDeals(favorites);
  }

  componentDidUpdate(prevProps) {
    const { favorites } = this.props;

    if (prevProps.favorites !== favorites) {
      this.fetchFavoriteDeals(favorites);
    }
  }

  fetchFavoriteDeals(favorites) {
    const { fetchFavoritesData } = this.props;

    fetchFavoritesData(DEALS_SCHEMA, favorites[DEALS_SCHEMA]).then(
      ({ payload }) => {
        const data = _.get(payload, 'data', []);
        this.fetchFavoriteDealTransactions(data);
      },
    );
  }

  fetchFavoriteDealTransactions(deals) {
    const { catalogId, fetchDealListTransactions } = this.props;
    const dealIdList = _.map(deals, 'id');

    if (!_.isEmpty(dealIdList)) {
      fetchDealListTransactions(catalogId, dealIdList);
    }
  }

  isCollectionValid(collection) {
    if (!isInitialized(collection) || isBusy(collection)) {
      // The collection is loading, treat it as valid for now
      return true;
    }

    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  renderPlaceholderView() {
    const { data } = this.props;

    const message = isError(data)
      ? I18n.t('shoutem.application.unexpectedErrorMessage')
      : I18n.t('shoutem.application.preview.noContentErrorMessage');

    return <EmptyStateView icon="deals" message={message} />;
  }

  renderRow(deals) {
    const { onOpenDealDetails } = this.props;

    const dealsViews = _.map(deals, deal => (
      <DealGridView deal={deal} key={deal.id} onPress={onOpenDealDetails} />
    ));

    return (
      <View styleName="flexible sm-gutter-bottom sm-gutter-left">
        <GridRow columns={2}>{dealsViews}</GridRow>
      </View>
    );
  }

  renderData(deals) {
    const groupedDeals = GridRow.groupByRows(deals, 2);
    cloneStatus(deals, groupedDeals);

    const loading = isBusy(groupedDeals) || !isInitialized(groupedDeals);

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
    const { data } = this.props;

    if (!this.isCollectionValid(data)) {
      return this.renderPlaceholderView();
    }

    return <View key="favorite-deals-list">{this.renderData(data)}</View>;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FavoriteDealsList'), {})(FavoriteDealsList));
