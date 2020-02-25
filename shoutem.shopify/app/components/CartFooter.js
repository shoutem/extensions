import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { I18n } from 'shoutem.i18n';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';

import { getCartTotal } from '../redux/selectors';
import { ext } from '../const';
import { shop as shopShape } from './shapes';

const renderStatusRow = (cartTotal, { currency }) => (
  <View styleName="horizontal md-gutter space-between">
    <Subtitle>{I18n.t(ext('totalPrice'))}</Subtitle>
    <Subtitle>
      {`${currency}${cartTotal}`}
    </Subtitle>
  </View>
);

const renderActionButton = (action, onActionButtonClicked) => (
  <View styleName="horizontal h-end md-gutter sm-gutter-top">
    <Button onPress={onActionButtonClicked} styleName="secondary">
      <Text styleName="bold">{action}</Text>
    </Button>
  </View>
);

/**
 * A component that displays a status row for a cart at checkout,
 * with a total price. Optionally, it has an action button to
 * proceed to the next step.
 */
const CartFooter = ({ action, cartTotal, shop, onActionButtonClicked }) => (
  <View>
    {renderStatusRow(cartTotal, shop)}
    {action ? renderActionButton(action, onActionButtonClicked) : null}
  </View>
);

const { func, string } = PropTypes;

CartFooter.propTypes = {
  // Action name, e.g. Proceed to checkout
  action: string,
  // Total price of items in the cart
  cartTotal: string.isRequired,
  // Function executed when associated action button is clicked,
  // e.g. proceeding to checkout
  onActionButtonClicked: func,
  // Shop, used to display currency
  shop: shopShape.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { shop } = state[ext()];

  return {
    cartTotal: getCartTotal(state),
    shop,
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('CartFooter'))(CartFooter),
);
