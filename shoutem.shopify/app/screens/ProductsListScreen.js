import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner, TabMenu, View } from '@shoutem/ui';
import { getScreenState, setScreenState } from 'shoutem.cms';
import {
  composeNavigationStyles,
  getRouteParams,
  HeaderIconButton,
  navigateTo,
} from 'shoutem.navigation';
import { QuickAddModal } from '../components';
import { CartIcon } from '../components/cart';
import ProductsList from '../components/ProductsList';
import {
  collection as collectionShape,
  shop as shopShape,
} from '../components/shapes';
import { ext } from '../const';
import { actions } from '../redux';
import {
  getCartSize,
  getCollectionsVisibleInShortcut,
} from '../redux/selectors';

/**
 * This is a base screen that allows users to browse through products and collections
 */
export class ProductsListScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      quickAddItem: undefined,
      quickAddVisible: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  componentDidUpdate() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  handleCloseQuickAddModal() {
    this.setState({
      quickAddItem: undefined,
      quickAddVisible: false,
    });
  }

  handleQuickBuyPress(item) {
    this.setState({
      quickAddItem: item,
      quickAddVisible: true,
    });
  }

  handleAddToCart(variant, quantity) {
    const { cartItemAdded } = this.props;
    const { quickAddItem } = this.state;

    cartItemAdded({ item: quickAddItem, variant, quantity }).then(
      this.handleCloseQuickAddModal,
    );
  }

  onCollectionSelected(collection) {
    const {
      collection: selectedCollection,
      refreshProducts,
      setScreenState,
    } = this.props;
    const { screenId } = getRouteParams(this.props);

    if (selectedCollection.id === collection.id) {
      return;
    }

    setScreenState(screenId, {
      collectionId: collection.id,
    });

    refreshProducts(collection.id);
  }

  getNavBarProps() {
    const { cartSize, hasFeaturedItem } = this.props;

    return {
      ...(hasFeaturedItem && { ...composeNavigationStyles(['featured']) }),
      headerRight: props => {
        return (
          <View virtual styleName="horizontal">
            <HeaderIconButton
              iconName="search"
              onPress={this.navigateToSearchScreen}
              {...props}
            />
            <CartIcon
              cartSize={cartSize}
              onPress={this.navigateToCart}
              iconProps={{ style: props.tintColor }}
            />
          </View>
        );
      },
    };
  }

  navigateToCart() {
    navigateTo(ext('CartScreen'));
  }

  navigateToSearchScreen() {
    const { collection } = this.props;

    navigateTo(ext('SearchProductsScreen'), { collectionId: collection.id });
  }

  renderCollectionsPicker() {
    const { collection, shop } = this.props;
    const { collections } = shop;

    return (
      <TabMenu
        options={collections}
        onOptionSelected={this.onCollectionSelected}
        selectedOption={collection || collections[0]}
      />
    );
  }

  /* eslint-disable class-methods-use-this */
  renderProducts(collectionId) {
    return (
      <ProductsList
        collectionId={collectionId}
        onQuickAddPress={this.handleQuickBuyPress}
      />
    );
  }

  render() {
    const { collection = {}, shop } = this.props;
    const { quickAddItem, quickAddVisible } = this.state;
    const { collections, isLoading } = shop;

    return (
      <Screen>
        {_.size(collections) > 1 && this.renderCollectionsPicker()}
        {isLoading ? (
          <Spinner styleName="md-gutter-top" />
        ) : (
          this.renderProducts(collection.id)
        )}
        <QuickAddModal
          visible={quickAddVisible}
          product={quickAddItem}
          onCancel={this.handleCloseQuickAddModal}
          onSubmit={this.handleAddToCart}
        />
      </Screen>
    );
  }
}

ProductsListScreen.propTypes = {
  cartItemAdded: PropTypes.func.isRequired,
  hasFeaturedItem: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  refreshProducts: PropTypes.func.isRequired,
  setScreenState: PropTypes.func.isRequired,
  shop: shopShape.isRequired,
  visibleCollections: PropTypes.array.isRequired,
  cartSize: PropTypes.number,
  collection: collectionShape,
  shortcut: PropTypes.shape({
    title: PropTypes.string,
  }),
};

ProductsListScreen.defaultProps = {
  cartSize: null,
  collection: null,
  shortcut: {},
};

export const mapStateToProps = (state, ownProps) => {
  const extState = state[ext()];
  const { shop } = extState;
  const {
    screenId,
    shortcut = {},
    screenSettings: { hasFeaturedItem = false },
  } = getRouteParams(ownProps);
  const { selectedCollections } = shortcut.settings || {};

  const data = getScreenState(state, screenId);
  const { collectionId } = data;

  const collections = getCollectionsVisibleInShortcut(
    state,
    selectedCollections,
  );

  return {
    cartSize: getCartSize(state),
    collection: _.find(collections, { id: collectionId }) || collections[0],
    shop: { ...shop, collections },
    visibleCollections: collections,
    shortcut,
    hasFeaturedItem,
  };
};

export const mapDispatchToProps = {
  refreshProducts: actions.refreshProducts,
  cartItemAdded: actions.cartItemAdded,
  setScreenState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductsListScreen'))(ProductsListScreen));
