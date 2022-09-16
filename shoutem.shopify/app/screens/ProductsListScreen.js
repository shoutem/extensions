import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { DropDownMenu, Screen, Spinner, View } from '@shoutem/ui';
import { getScreenState, setScreenState } from 'shoutem.cms';
import {
  getRouteParams,
  HeaderIconButton,
  navigateTo,
} from 'shoutem.navigation';
import { CartIcon } from '../components/cart';
import ProductsList from '../components/ProductsList';
import {
  collection as collectionShape,
  shop as shopShape,
} from '../components/shapes';
import { ext } from '../const';
import { refreshProducts } from '../redux/actionCreators';
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
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  componentDidUpdate() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
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
    const { cartSize } = this.props;

    return {
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

  renderCollectionsPicker(styleName = 'horizontal') {
    const { collection, shop } = this.props;
    const { collections } = shop;

    return (
      <DropDownMenu
        onOptionSelected={this.onCollectionSelected}
        options={collections}
        selectedOption={collection || collections[0]}
        titleProperty="title"
        valueProperty="id"
        styleName={styleName}
      />
    );
  }

  /* eslint-disable class-methods-use-this */
  renderProducts(collectionId) {
    return <ProductsList collectionId={collectionId} />;
  }

  render() {
    const { collection = {}, shop } = this.props;
    const { collections, isLoading } = shop;

    return (
      <Screen>
        {_.size(collections) > 1 ? this.renderCollectionsPicker() : null}
        {isLoading ? (
          <Spinner styleName="md-gutter-top" />
        ) : (
          this.renderProducts(collection.id)
        )}
      </Screen>
    );
  }
}

ProductsListScreen.propTypes = {
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
  const { screenId, shortcut = {} } = getRouteParams(ownProps);
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
  };
};

export const mapDispatchToProps = {
  refreshProducts,
  setScreenState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductsListScreen'))(ProductsListScreen));
