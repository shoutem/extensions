import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setScreenState, getScreenState } from 'shoutem.cms';
import {
  getRouteParams,
  HeaderIconButton,
  navigateTo,
} from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { DropDownMenu, Screen, View, Spinner } from '@shoutem/ui';
import CartIcon from '../components/CartIcon';
import ProductsList from '../components/ProductsList';
import {
  collection as collectionShape,
  shop as shopShape,
} from '../components/shapes';
import { refreshProducts } from '../redux/actionCreators';
import { getCartSize } from '../redux/selectors';
import { ext } from '../const';

/**
 * This is a base screen that allows users to browse through products and collections
 */
export class ProductsListScreen extends PureComponent {
  static propTypes = {
    // Number of items that the user has added to his cart
    cartSize: PropTypes.number.isRequired,
    // Selected collection
    collection: collectionShape,
    // Dispatched when the user selects a collection to load products that belong
    // to that collection
    refreshProducts: PropTypes.func.isRequired,
    // Dispatched when a collection is selected to persist it for this screen
    setScreenState: PropTypes.func.isRequired,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
    // Shortcut that opens this screen
    shortcut: PropTypes.shape({
      title: PropTypes.string,
    }),
    // Collections which are selected in shortcut settings
    visibleCollections: PropTypes.array,
    navigation: PropTypes.object.isRequired,
  };

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
        titleProperty={'title'}
        valueProperty={'id'}
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

/**
 * Filters collections to show only those that are
 * selected in shortcut settings.
 */
const getCollectionsVisibleInShortcut = (
  selectedCollections,
  allCollections,
) => {
  const getId = k => parseFloat(decode64(k).split('/')[4]);

  return _.filter(allCollections, collection => {
    return (
      !_.size(selectedCollections) ||
      _.includes(selectedCollections, getId(collection.id))
    );
  });
};

export const mapStateToProps = (state, ownProps) => {
  const extState = state[ext()];
  const { shop } = extState;
  const { screenId, shortcut = {} } = getRouteParams(ownProps);
  const { selectedCollections } = shortcut.settings || {};

  const data = getScreenState(state, screenId);
  const { collectionId } = data;

  const collections = getCollectionsVisibleInShortcut(
    selectedCollections,
    shop.collections,
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

const keyStr =
  'ABCDEFGHIJKLMNOP' +
  'QRSTUVWXYZabcdef' +
  'ghijklmnopqrstuv' +
  'wxyz0123456789+/' +
  '=';

function encode64(input) {
  input = escape(input);
  let output = '';
  let chr1;
  let chr2;
  let chr3 = '';
  let enc1;
  let enc2;
  let enc3;
  let enc4 = '';
  let i = 0;

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

    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);

  return output;
}

function decode64(input) {
  let output = '';
  let chr1;
  let chr2;
  let chr3 = '';
  let enc1;
  let enc2;
  let enc3;
  let enc4 = '';
  let i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  const base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    alert(
      'There were invalid base64 characters in the input text.\n' +
      "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
      'Expect errors in decoding.',
    );
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

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

    chr1 = chr2 = chr3 = '';
    enc1 = enc2 = enc3 = enc4 = '';
  } while (i < input.length);

  return unescape(output);
}
