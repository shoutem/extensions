import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  DropDownMenu,
  Icon,
  Screen,
  View,
  Spinner,
} from '@shoutem/ui';

import { I18n } from 'shoutem.i18n';
import {
  NavigationBar,
  getScreenState,
  navigateTo,
  setScreenState,
} from 'shoutem.navigation';

import CartIcon from '../components/CartIcon';
import ProductsList from '../components/ProductsList';
import {
  collection as collectionShape,
  shop as shopShape,
} from '../components/shapes';
import { refreshProducts } from '../redux/actionCreators';
import { getCartSize } from '../redux/selectors';
import { ext } from '../const';

const { array, func, number, shape, string } = PropTypes;

/**
 * This is a base screen that allows users to browse through products and collections
 */
export class ProductsListScreen extends PureComponent {
  static propTypes = {
    // Number of items that the user has added to his cart
    cartSize: number.isRequired,
    // Selected collection
    collection: collectionShape,
    // Used to navigate to cart
    navigateTo: func.isRequired,
    // Dispatched when the user selects a collection to load products that belong
    // to that collection
    refreshProducts: func.isRequired,
    // ID of this screen, used to persist the selected collection
    screenId: string.isRequired,
    // Dispatched when a collection is selected to persist it for this screen
    setScreenState: func.isRequired,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
    // Shortcut that opens this screen
    shortcut: shape({
      title: string,
    }),
    // Collections which are selected in shortcut settings
    visibleCollections: array,
  };

  constructor(props) {
    super(props);

    this.navigateToCart = this.navigateToCart.bind(this);
    this.navigateToSearchScreen = this.navigateToSearchScreen.bind(this);
    this.onCollectionSelected = this.onCollectionSelected.bind(this);
  }

  onCollectionSelected(collection) {
    const { collection: selectedCollection, refreshProducts,
      setScreenState, screenId } = this.props;

    if (selectedCollection.id === collection.id) {
      return;
    }

    setScreenState(screenId, {
      collectionId: collection.id,
    });

    refreshProducts(collection.id);
  }

  getNavBarProps() {
    const { cartSize, shortcut } = this.props;

    return {
      renderRightComponent: () => {
        return (
          <View virtual styleName="container">
            <Button
              onPress={this.navigateToSearchScreen}
              styleName="clear"
            >
              <Icon name="search" />
            </Button>
            <CartIcon cartSize={cartSize} onPress={this.navigateToCart} />
          </View>
        );
      },
      title: shortcut.title || I18n.t(ext('shopTitlePlaceholder')),
    };
  }

  navigateToCart() {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('CartScreen'),
    });
  }

  navigateToSearchScreen() {
    const { collection, navigateTo } = this.props;

    navigateTo({
      screen: ext('SearchProductsScreen'),
      props: {
        collectionId: collection.id,
      },
    });
  }

  renderCollectionsPicker(styleName = 'horizontal') {
    const { collection, shop } = this.props;
    const { collections } = shop;

    return (
      <DropDownMenu
        onOptionSelected={this.onCollectionSelected}
        options={collections}
        selectedOption={collection || collections[0]}
        titleProperty={'title'}
        valueProperty={'id'}
        styleName={styleName}
      />
    );
  }

  /* eslint-disable class-methods-use-this */
  renderProducts(collectionId) {
    return (
      <ProductsList collectionId={collectionId} />
    );
  }

  render() {
    const { collection = {}, shop } = this.props;
    const { collections, isLoading } = shop;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        {_.size(collections) > 1 ? this.renderCollectionsPicker() : null}
        {isLoading ?
          <Spinner styleName="md-gutter-top"/> :
          this.renderProducts(collection.id)
        }
      </Screen>
    );
  }
}

/**
 * Filters collections to show only those that are
 * selected in shortcut settings.
 */
const getCollectionsVisibleInShortcut = (
  selectedCollections,
  allCollections
) => {
  const getId = k => parseFloat(decode64(k).split('/')[4]);

  return _.filter(allCollections, collection =>
    {
      return !_.size(selectedCollections) ||
        _.includes(selectedCollections, getId(collection.id))
    }
  );
};

export const mapStateToProps = (state, ownProps) => {
  const extState = state[ext()];
  const { shop } = extState;
  const { screenId, shortcut = {} } = ownProps;
  const { selectedCollections } = shortcut.settings || {};

  const data = getScreenState(state, screenId);
  const { collectionId } = data;

  const collections =
    getCollectionsVisibleInShortcut(selectedCollections, shop.collections);

  return {
    cartSize: getCartSize(state),
    collection: _.find(collections, { 'id': collectionId }) || collections[0],
    shop: { ...shop, collections },
    visibleCollections: collections,
    shortcut,
  };
};

export const mapDispatchToProps = {
  navigateTo,
  refreshProducts,
  setScreenState
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductsListScreen'))(ProductsListScreen),
);

var keyStr = "ABCDEFGHIJKLMNOP" +
  "QRSTUVWXYZabcdef" +
  "ghijklmnopqrstuv" +
  "wxyz0123456789+/" +
  "=";

function encode64(input) {
  input = escape(input);
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
        enc4 = 64;
      }

    output = output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);

  return output;
}

function decode64(input) {
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    alert("There were invalid base64 characters in the input text.\n" +
      "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
      "Expect errors in decoding.");
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }

    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }

    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";

  } while (i < input.length);

  return unescape(output);
}
