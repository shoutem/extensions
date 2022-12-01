import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { find } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { EmptyStateView, ListView, Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getCurrentRoute, navigateTo } from 'shoutem.navigation';
import { ext, PAGE_SIZE } from '../const';
import { cartItemAdded, refreshProducts } from '../redux/actionCreators';
import { getProducts } from '../redux/selectors';
import FeaturedItem from './FeaturedItem';
import ListItem from './ListItem';
import { product as productShape, shop as shopShape } from './shapes';

/**
 * A component that displays a list of products,
 * used in the main products screen and search
 * screen. Lets the user navigate to product
 * details or add a product to cart.
 */
export class ProductsList extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const {
      shop: { error },
    } = this.props;

    if (error) {
      return;
    }

    this.refreshData();
  }

  onLoadMore() {
    const {
      productsState: { products },
    } = this.props;

    if (_.size(products) < PAGE_SIZE) {
      return;
    }

    this.refreshData();
  }

  getNoProductsView() {
    return (
      <EmptyStateView
        icon="refresh"
        message={I18n.t(ext('noItemsInCollection'))}
        retryButtonTitle={I18n.t('shoutem.application.tryAgainButton')}
        onRetry={() => this.refreshData(true)}
      />
    );
  }

  getNoProductsForTagView() {
    const { tag } = this.props;

    const message = `${I18n.t(ext('noItemsWithSpecificTag'))}"${tag}".`;

    return <EmptyStateView icon="search" message={message} />;
  }

  navigateToProductDetails(item) {
    // featured item is received as array, bug with @shoutem/ui
    const resolvedItem = Array.isArray(item) ? item[0] : item;

    navigateTo(ext('ProductDetailsScreen'), {
      productId: resolvedItem.id,
      analyticsPayload: {
        itemId: resolvedItem.id,
        itemName: resolvedItem.name,
      },
    });
  }

  // Called to load more products when the component is mounted or
  // the list scrolled beyond visible items
  refreshData(resetMode) {
    const { collectionId, refreshProducts, tag } = this.props;
    refreshProducts(collectionId, tag, resetMode);
  }

  renderFeaturedProduct(item) {
    const { shop, onQuickAddPress } = this.props;

    // featured item is received as array, bug with @shoutem/ui
    const resolvedItem = Array.isArray(item) ? item[0] : item;

    return resolvedItem ? (
      <FeaturedItem
        item={resolvedItem}
        onAddToCart={() => onQuickAddPress(resolvedItem)}
        onPress={() => this.navigateToProductDetails(resolvedItem)}
        shop={shop}
      />
    ) : null;
  }

  renderProductRow(item) {
    if (!item) return null;

    const { shop, onQuickAddPress } = this.props;

    return (
      <ListItem
        item={item}
        onAddToCart={() => onQuickAddPress(item)}
        onPress={() => this.navigateToProductDetails(item)}
        shop={shop}
      />
    );
  }

  renderEmptyScreen() {
    const { tag } = this.props;

    return tag ? this.getNoProductsForTagView() : this.getNoProductsView();
  }

  renderProducts(products, isLoading) {
    const { hasFeaturedItem } = this.props;

    return (
      <ListView
        data={products}
        loading={isLoading}
        onLoadMore={this.onLoadMore}
        onRefresh={() => this.refreshData(true)}
        renderRow={this.renderProductRow}
        hasFeaturedItem={hasFeaturedItem}
        renderFeaturedItem={item => this.renderFeaturedProduct(item)}
        scrollIndicatorInsets={{ right: 1 }}
      />
    );
  }

  renderContent() {
    const { productsState, shop } = this.props;
    const { isLoading: productsLoading, products } = productsState;
    const { isLoading: shopLoading } = shop;

    const isLoading = productsLoading || shopLoading;

    return isLoading || _.size(products)
      ? this.renderProducts(products, isLoading)
      : this.renderEmptyScreen();
  }

  render() {
    const {
      shop: { error },
    } = this.props;

    if (error) {
      const message = I18n.t(ext('fetchingShopErrorMessage'));

      return <EmptyStateView message={message} />;
    }

    return <Screen>{this.renderContent()}</Screen>;
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shop } = state[ext()];
  const { collectionId, tag } = ownProps;

  const productsState = getProducts(state, collectionId, tag);
  const currentRoute = getCurrentRoute();
  const activeShortcut = _.get(currentRoute, 'params.shortcut');
  const screens = _.get(activeShortcut, 'screens');
  const activeScreen = screens ? screens[0] : null;
  const hasFeaturedItem = _.get(
    activeScreen,
    'settings.hasFeaturedItem',
    false,
  );
  const listType = _.get(activeScreen, 'settings.listType', 'list');

  return {
    hasFeaturedItem,
    listType,
    productsState,
    shop,
  };
};

ProductsList.propTypes = {
  collectionId: PropTypes.string.isRequired,
  hasFeaturedItem: PropTypes.bool.isRequired,
  productsState: PropTypes.shape({
    error: PropTypes.bool,
    isLoading: PropTypes.bool,
    products: PropTypes.arrayOf(productShape),
  }).isRequired,
  refreshProducts: PropTypes.func.isRequired,
  shop: shopShape.isRequired,
  onQuickAddPress: PropTypes.func.isRequired,
  tag: PropTypes.string,
};

ProductsList.defaultProps = {
  tag: null,
};

export const mapDispatchToProps = {
  cartItemAdded,
  find,
  refreshProducts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductsList'))(ProductsList));
