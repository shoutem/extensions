import PropTypes from 'prop-types';
import React from 'react';

import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Text, View } from '@shoutem/ui';

import { ext } from '../const';

/**
 * Displays a cart icon and a badge with number of items in it (if any).
 */
const getBadge = quantity => (
  <View styleName="badge">
    <Text>{quantity < 10 ? quantity : '...'}</Text>
  </View>
);

const CartIcon = ({ cartSize, onPress, style, iconProps }) => {
  return (
    <Button styleName="clear" style={style} onPress={onPress}>
      <Icon name="cart" {...iconProps} />
      {cartSize ? getBadge(cartSize) : null}
    </Button>
  );
};

const { func, number } = PropTypes;

CartIcon.propTypes = {
  // Number of items in the cart - a badge with this number will be shown above the cart
  // when there is at least one item in it
  cartSize: number.isRequired,
  // Called when the cart is clicked and has items in it
  onPress: func.isRequired,
  style: PropTypes.object,
  iconProps: PropTypes.object,
};

export default connectStyle(ext('CartIcon'), {}, () => { }, { virtual: true })(
  CartIcon,
);
