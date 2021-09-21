import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  Caption,
  Divider,
  Icon,
  ListView,
  Screen,
  ScrollView,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { closeModal, openInModal } from 'shoutem.navigation';
import CartFooter from '../components/CartFooter';
import CartItem from '../components/CartItem';
import { cart as cartShape, shop as shopShape } from '../components/shapes';
import { cartItemRemoved, cartItemUpdated } from '../redux/actionCreators';
import { ext } from '../const';
import UpdateItemScreen from './UpdateItemScreen';

/**
 * Displays a list of items that the user has added to his cart, the total price, and
 * a button that lets him proceed to checkout
 */
class CartScreen extends PureComponent {
  static propTypes = {
    // A list of cart items, where an item is defined by a combination of product, its variant
    // and quantity
    cart: cartShape.isRequired,
    // Action dispatched when an item is removed from the cart
    cartItemRemoved: PropTypes.func.isRequired,
    // Action dispatched when a cart item is updated
    cartItemUpdated: PropTypes.func.isRequired,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      selectedItem: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({ title: I18n.t(ext('cartScreenNavBarTitle')) });
  }

  onItemUpdated(actionType, cartItem, updates) {
    const { cartItemRemoved, cartItemUpdated } = this.props;
    const { remove } = UpdateItemScreen.actionTypes;

    if (actionType === remove) {
      cartItemRemoved(cartItem);
    } else {
      const { variant: newVariant, quantity } = updates;

      cartItemUpdated(cartItem, newVariant, quantity);
    }

    closeModal();
  }

  onEditItem(cartItem) {
    const { item, variant, quantity } = cartItem;

    const routeParams = {
      item,
      variant,
      quantity,
      onActionButtonClicked: (actionType, updates) =>
        this.onItemUpdated(actionType, cartItem, updates),
    };

    openInModal(ext('UpdateItemScreen'), routeParams);
  }

  proceedToCheckout() {
    openInModal(ext('CheckoutScreen'));
  }

  renderRow(cartItem) {
    const { shop } = this.props;

    return (
      <TouchableOpacity onPress={() => this.onEditItem(cartItem)}>
        <CartItem cartItem={cartItem} shop={shop} />
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    const { cart } = this.props;

    return (
      <Screen>
        {!_.size(cart) && (
          <View styleName="flexible vertical h-center v-center xl-gutter-horizontal">
            <View styleName="oval-highlight">
              <Icon name="cart" />
            </View>
            <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">
              {I18n.t(ext('emptyCartMessage'))}
            </Subtitle>
          </View>
        )}
        {!!_.size(cart) && (
          <ScrollView>
            <Divider styleName="section-header">
              <Caption>{I18n.t(ext('cartScreenProductName'))}</Caption>
              <Caption>{I18n.t(ext('cartScreenProductPrice'))}</Caption>
            </Divider>
            <ListView data={cart} renderRow={this.renderRow} />
            <Divider styleName="line" />
            <CartFooter
              action={I18n.t(ext('proceedToCheckoutButton'))}
              onActionButtonClicked={this.proceedToCheckout}
            />
          </ScrollView>
        )}
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { cart, shop } = state[ext()];

  return {
    cart,
    shop,
  };
};

const mapDispatchToProps = {
  cartItemRemoved,
  cartItemUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('CartScreen'))(CartScreen));
