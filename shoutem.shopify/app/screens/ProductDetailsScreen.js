import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Heading,
  Html,
  Icon,
  ImageGallery,
  InlineGallery,
  Overlay,
  PageIndicators,
  Screen,
  ScrollView,
  Subtitle,
  Text,
  Tile,
  Title,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import {
  closeModal,
  getRouteParams,
  HeaderCloseButton,
  navigateTo,
  openInModal,
} from 'shoutem.navigation';
import { CartIcon } from '../components/cart';
import {
  product as productShape,
  shop as shopShape,
} from '../components/shapes';
import { ext } from '../const';
import { cartItemAdded } from '../redux/actionCreators';
import { getCartSize } from '../redux/selectors';
import { getDiscount } from '../services';
import UpdateItemScreen from './UpdateItemScreen';

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
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      selectedImageIndex: 0,
      shouldRenderImageGallery: false,
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

  getNavBarProps() {
    const { cartSize } = this.props;
    const { shouldRenderImageGallery } = this.state;

    const closeGalleryButton = props => (
      <HeaderCloseButton {...props} onPress={this.closeImageGallery} />
    );

    const openCartButton = props => (
      <View styleName="container">
        <CartIcon
          cartSize={cartSize}
          onPress={this.navigateToCart}
          iconProps={{ style: props.tintColor }}
        />
      </View>
    );

    const headerRight = shouldRenderImageGallery
      ? closeGalleryButton
      : openCartButton;

    return { headerRight, title: '' };
  }

  onAddToCart() {
    const { item } = this.props;
    const { add } = UpdateItemScreen.actionTypes;

    const routeParams = {
      actionType: add,
      item,
      onActionButtonClicked: (type, { variant, quantity }) =>
        this.addItemToCart(variant, quantity),
    };

    openInModal(ext('UpdateItemScreen'), routeParams);
  }

  onIndexSelected(index) {
    this.setState({ selectedImageIndex: index });
  }

  closeImageGallery() {
    this.setState({ shouldRenderImageGallery: false });
  }

  addItemToCart(variant, quantity) {
    const { item, cartItemAdded } = this.props;

    cartItemAdded({ item, variant, quantity });

    closeModal();
  }

  navigateToCart() {
    navigateTo(ext('CartScreen'));
  }

  renderFullScreenGallery() {
    const {
      item: { images },
    } = this.props;
    const { selectedImageIndex } = this.state;

    const data = _.map(images, image => ({
      source: { uri: image.url },
      title: '',
    }));

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
    const {
      item: { images },
    } = this.props;
    const { selectedImageIndex } = this.state;

    const data = _.map(images, image => ({ source: { uri: image.url } }));

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
          {!!discount && newPrice < oldPrice && (
            <Overlay styleName="image-overlay">
              <Heading>{`${resolvedDiscount}%`}</Heading>
            </Overlay>
          )}
          <Title styleName="h-center md-gutter-top">{title}</Title>
          {!!newPrice && newPrice < oldPrice ? (
            <Subtitle styleName="line-through md-gutter-top">
              {oldPriceString}
            </Subtitle>
          ) : null}
          <Heading styleName="md-gutter-top">{newPriceString}</Heading>
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
        {!shouldRenderImageGallery ? (
          <ScrollView>
            <View styleName="placeholder">{this.renderGallery()}</View>
            {this.renderProductHeader()}
            {!!body_html && <Html body={body_html} />}
          </ScrollView>
        ) : (
          this.renderFullScreenGallery()
        )}
      </Screen>
    );
  }
}

ProductDetailsScreen.propTypes = {
  cartItemAdded: PropTypes.func.isRequired,
  item: productShape.isRequired,
  navigation: PropTypes.object.isRequired,
  shop: shopShape.isRequired,
  cartSize: PropTypes.number,
};

ProductDetailsScreen.defaultProps = {
  cartSize: null,
};

const mapStateToProps = (state, ownProps) => {
  const { products, shop } = state[ext()];
  const { productId } = getRouteParams(ownProps);

  return {
    cartSize: getCartSize(state),
    item: products[productId],
    shop,
  };
};

const mapDispatchToProps = {
  cartItemAdded,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductDetailsScreen'))(ProductDetailsScreen));
