import React, {
  Component,
} from 'react';

import { Modal } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Button,
  Heading,
  Icon,
  Image,
  ImageGallery,
  InlineGallery,
  NavigationBar as UINavigationBar,
  Overlay,
  PageIndicators,
  RichMedia,
  Screen,
  ScrollView,
  Subtitle,
  Text,
  Tile,
  Title,
  View,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';
import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';

import { closeModal, openInModal } from 'shoutem.navigation';

import { ext } from '../const';
import CartIcon from '../components/CartIcon';
import UpdateItemScreen from './UpdateItemScreen';

import {
  product as productShape,
  shop as shopShape,
} from '../components/shapes';

import { cartItemAdded } from '../redux/actionCreators';
import { getCartSize } from '../redux/selectors';

const { func, number } = React.PropTypes;

const getDiscount = (price, originalPrice) =>
    Math.round((100 * (parseFloat(price) - parseFloat(originalPrice))) / parseFloat(originalPrice));

const renderPageIndicators = (selectedIndex, data) => {
  if (_.size(data) > 1) {
    return (
      // TODO change this with gradient when shoutem/ui-private#28 gets merged
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Image
          style={{ width: null }}
          source={require('../assets/images/gradient.png')}
        >
          <PageIndicators
            activeIndex={selectedIndex}
            count={_.size(data)}
          />
        </Image>
      </View>
    );
  }
  return null;
};

/**
 * Lets the user view more details about the product, such as a gallery of images and a
 * detailed description. The user can also add a product to cart from this screen or go to
 * cart.
 */
class ProductDetailsScreen extends Component {
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

    this.onAddToCart = this.onAddToCart.bind(this);
    this.onIndexSelected = this.onIndexSelected.bind(this);
    this.navigateToCart = this.navigateToCart.bind(this);

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

  getImageGalleryNavbarProps() {
    return {
      styleName: 'clear',
      leftComponent: (
        <Button styleName="clear tight" onPress={() => this.setState({ shouldRenderImageGallery: false })}>
          <Icon name="close" />
        </Button>
      ),
    };
  }

  getNavBarProps() {
    const { cartSize } = this.props;

    return {
      renderRightComponent: () => {
        return (
          <View virtual styleName="container">
            <CartIcon
              cartSize={cartSize}
              onPress={this.navigateToCart}
            />
          </View>
        );
      },
    };
  }

  addItemToCart(variant, quantity) {
    const { item, cartItemAdded, closeModal } = this.props;

    cartItemAdded({ item, variant, quantity });

    closeModal();
  }

  navigateToCart() {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('CartScreen'),
    });
  }

  renderImageGallery() {
    const { images } = this.props.item;
    const { selectedImageIndex, shouldRenderImageGallery } = this.state;

    const data = _.map(images, image => ({ source: { uri: image.src }, title: '' }));

    return (
      <Modal
        visible={shouldRenderImageGallery}
        onRequestClose={() => this.setState({ shouldRenderImageGallery: false })}
      >
        <ImageGallery
          data={data}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedImageIndex}
        />
        {<UINavigationBar {...this.getImageGalleryNavbarProps()} />}
      </Modal>
    );
  }

  renderGallery() {
    const { images } = this.props.item;
    const { selectedImageIndex } = this.state;

    const data = _.map(images, image => ({ source: { uri: image.src } }));

    return (
      <InlineGallery
        data={data}
        onPress={() => this.setState({ shouldRenderImageGallery: true })}
        onIndexSelected={this.onIndexSelected}
        selectedIndex={selectedImageIndex}
        renderOverlay={renderPageIndicators}
        style={{
          container: { height: 375 },
          pager: { pageMargin: 20 } }}
        styleName="large-wide"
      />
    );
  }

  renderProductHeader() {
    const { minimum_price, minimum_compare_at_price, title } = this.props.item;
    const { currency } = this.props.shop;

    return (
      <Tile>
        <View styleName="content vertical h-center">
          { minimum_compare_at_price ?
            <Overlay>
              <View>
                <Heading styleName="md-gutter-top">
                  {`${getDiscount(minimum_price, minimum_compare_at_price)} %`}
                </Heading>
              </View>
            </Overlay>
            :
            null
          }
          <Title styleName="h-center md-gutter-top">{ title }</Title>
          { minimum_compare_at_price ?
            <Subtitle styleName="line-through md-gutter-top">
              {`${minimum_compare_at_price} ${currency}`}
            </Subtitle>
            :
            null
          }
          <Heading styleName="md-gutter-top">{ `${minimum_price} ${currency}` }</Heading>
          <Button
            styleName="secondary md-gutter-vertical"
            onPress={this.onAddToCart}
          >
            <Icon name="cart" />
            <Text>ADD TO BASKET</Text>
          </Button>
        </View>
      </Tile>
    );
  }

  render() {
    const { body_html } = this.props.item;

    return (
      <Screen styleName="paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          <View styleName="placeholder">
            {this.renderGallery()}
          </View>
          {this.renderProductHeader()}
          <RichMedia body={body_html} />
        </ScrollView>
        { this.renderImageGallery() }
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

const mapDispatchToProps = { cartItemAdded, closeModal, navigateTo, openInModal };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductDetailsScreen'))(ProductDetailsScreen),
);
