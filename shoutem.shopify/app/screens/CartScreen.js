import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Icon,
  ListView,
  Screen,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { closeModal, openInModal } from 'shoutem.navigation';
import { CartFooter, CartItem } from '../components/cart';
import { cart as cartShape, shop as shopShape } from '../components/shapes';
import { ext } from '../const';
import { cartItemRemoved, cartItemUpdated } from '../redux/actionCreators';
import UpdateItemScreen from './UpdateItemScreen';

/**
 * Displays a list of items that the user has added to his cart, the total price, and
 * a button that lets him proceed to checkout
 */
class CartScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
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
      </TouchableOpacity>
    );
  }

  render() {
    const { cart, style } = this.props;

    const cartSize = _.size(cart);

    return (
      <Screen style={style.screen}>
        {!cartSize && (
          <View styleName="flexible vertical h-center v-center xl-gutter-horizontal">
            <View styleName="oval-highlight">
              <Icon name="cart" />
            </View>
            <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">
              {I18n.t(ext('emptyCartMessage'))}
            </Subtitle>
          </View>
        )}
        {!!cartSize && (
          <View style={style.contentContainer}>
            <ListView
              data={cart}
              renderRow={this.renderRow}
              style={style.list}
            />
            <CartFooter
              action={I18n.t(ext('proceedToCheckoutButton'))}
              onActionButtonClicked={this.proceedToCheckout}
            />
          </View>
        )}
      </Screen>
    );
  }
}

CartScreen.propTypes = {
  cart: cartShape.isRequired,
  cartItemRemoved: PropTypes.func.isRequired,
  cartItemUpdated: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  shop: shopShape.isRequired,
  style: PropTypes.object.isRequired,
};

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
