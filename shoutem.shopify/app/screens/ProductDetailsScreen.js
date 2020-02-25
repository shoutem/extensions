import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Modal } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { I18n } from 'shoutem.i18n';
import {
  NavigationBar,
  navigateTo,
  closeModal,
  openInModal,
} from 'shoutem.navigation';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Heading,
  Icon,
  ImageGallery,
  InlineGallery,
  Overlay,
  PageIndicators,
  Html,
  Screen,
  ScrollView,
  Subtitle,
  Text,
  Tile,
  Title,
  View,
} from '@shoutem/ui';

import CartIcon from '../components/CartIcon';
import {
  product as productShape,
  shop as shopShape,
} from '../components/shapes';
import { cartItemAdded } from '../redux/actionCreators';
import { getCartSize } from '../redux/selectors';
import { getDiscount } from '../services/getDiscount';
import { ext } from '../const';
import UpdateItemScreen from './UpdateItemScreen';

const { func, number } = PropTypes;

const renderPageIndicators = (data, selectedIndex) => {
  if (_.size(data) < 2) {
    return null;
  }

  return (
    <PageIndicators
      activeIndex={selectedIndex}
      count={_.size(data)}
      styleName="overlay-bottom"
    />
  );
};

/**
 * Lets the user view more details about the product, such as a
 * gallery of images and a detailed description. The user can
 * also add a product to cart from this screen or go to cart.
 */
class ProductDetailsScreen extends PureComponent {
  static propTypes = {
    // Number of items that the user has added to his cart
    cartSize: number,
    // Action dispatched when a product has been added to the cart
    cartItemAdded: func.isRequired,
    // Used to close modal after an item has been added to the cart
    closeModal: func,
    // Used to navigate to cart
    navigateTo: func.isRequired,
    // Used to open the add to cart screen in modal
    openInModal: func,
    // Product for which details are shown
    item: productShape.isRequired,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
  }

  constructor(props) {
    super(props);

    this.closeImageGallery = this.closeImageGallery.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.navigateToCart = this.navigateToCart.bind(this);
    this.onAddToCart = this.onAddToCart.bind(this);
    this.onIndexSelected = this.onIndexSelected.bind(this);

    this.state = {
      selectedImageIndex: 0,
      shouldRenderImageGallery: false,
    };
  }

  onAddToCart() {
    const { item, openInModal } = this.props;
    const { add } = UpdateItemScreen.actionTypes;

    const route = {
      screen: ext('UpdateItemScreen'),
      props: {
        actionType: add,
        item,
        onActionButtonClicked: (type, { variant, quantity }) =>
          this.addItemToCart(variant, quantity),
      },
    };
    openInModal(route);
  }

  onIndexSelected(index) {
    this.setState({ selectedImageIndex: index });
  }

  closeImageGallery() {
    this.setState({ shouldRenderImageGallery: false });
  }

  getNavBarProps() {
    const { cartSize } = this.props;
    const { shouldRenderImageGallery } = this.state;

    const closeGalleryButton = (
      <Button styleName="clear" onPress={this.closeImageGallery}>
        <Icon name="close" />
      </Button>
    );

    const openCartButton = (
      <View virtual styleName="container">
        <CartIcon cartSize={cartSize} onPress={this.navigateToCart} />
      </View>
    );

    return {
      renderRightComponent: () => {
        return shouldRenderImageGallery ? closeGalleryButton : openCartButton;
      }
    }
  }

  addItemToCart(variant, quantity) {
    const { item, cartItemAdded, closeModal } = this.props;

    cartItemAdded({ item, variant, quantity });

    closeModal();
  }

  navigateToCart() {
    const { navigateTo } = this.props;

    navigateTo({ screen: ext('CartScreen') });
  }

  renderFullScreenGallery() {
    const { item: { images } } = this.props;
    const { selectedImageIndex, shouldRenderImageGallery } = this.state;

    const data = _.map(images, image =>
      ({ source: { uri: image.src }, title: '' })
    );

    return (
      <Screen>
        <ImageGallery
          data={data}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedImageIndex}
        />
      </Screen>
    );
  }

  renderGallery() {
    const { item: { images } } = this.props;
    const { selectedImageIndex } = this.state;

    const data = _.map(images, image => ({ source: { uri: image.src } }));

    return (
      <InlineGallery
        data={data}
        onPress={() => this.setState({ shouldRenderImageGallery: true })}
        onIndexSelected={this.onIndexSelected}
        selectedIndex={selectedImageIndex}
        renderOverlay={renderPageIndicators}
        styleName="large-square"
      />
    );
  }

  renderProductHeader() {
    const {
      item,
      item: { title, descriptionHtml },
      shop: { currency },
    } = this.props;

    const variant = item.variants[0];

    const newPrice = parseFloat(variant.price);
    const oldPrice = parseFloat(variant.compareAtPrice);
    const discount = getDiscount(oldPrice, newPrice);
    const resolvedDiscount = discount === Infinity ? '-100' : discount;

    const newPriceString = `${currency}${newPrice}`;
    const oldPriceString = oldPrice ? `${currency}${oldPrice}` : null;

    return (
      <Tile>
        <View styleName="content vertical h-center">
          {(!!discount && (newPrice < oldPrice)) &&
            <Overlay styleName="image-overlay">
              <Heading>
                  {`${resolvedDiscount}%`}
              </Heading>
            </Overlay>
          }
          <Title styleName="h-center md-gutter-top">{title}</Title>
          {(!!newPrice && newPrice < oldPrice) ?
            <Subtitle styleName="line-through md-gutter-top">
              {oldPriceString}
            </Subtitle> : null
          }
          <Heading styleName="md-gutter-top">
            {newPriceString}
          </Heading>
          <Button
            styleName="secondary md-gutter-vertical"
            onPress={this.onAddToCart}
          >
            <Icon name="cart" />
            <Text>{I18n.t(ext('addToCartButton'))}</Text>
          </Button>
          <Html body={descriptionHtml} />
        </View>
      </Tile>
    );
  }

  render() {
    const { shouldRenderImageGallery } = this.state;
    const body_html = _.get(this.props, 'item.body_html');

    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps()} />
        {!shouldRenderImageGallery ?
          <ScrollView>
            <View styleName="placeholder">
              {this.renderGallery()}
            </View>
            {this.renderProductHeader()}
            {!!body_html && <Html body={body_html} />}
          </ScrollView> : this.renderFullScreenGallery()
        }
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { products, shop } = state[ext()];
  const { productId } = ownProps;

  return {
    cartSize: getCartSize(state),
    item: products[productId],
    shop,
  };
};

const mapDispatchToProps = {
  cartItemAdded,
  closeModal,
  navigateTo,
  openInModal
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductDetailsScreen'))(ProductDetailsScreen),
);
