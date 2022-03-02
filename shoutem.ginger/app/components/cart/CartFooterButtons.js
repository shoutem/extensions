import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { useCartPriceBreakdown } from '../../services';

export function CartFooterButtons({
  style,
  onCheckoutPress,
  onBack,
  cartData,
}) {
  const { totalPrice, isBelowMinimumOrder } = useCartPriceBreakdown(cartData);

  return (
    <View>
      <View style={style.container}>
        <Button style={style.button} onPress={onBack} styleName="secondary">
          <Text style={style.indicatorText}>
            {I18n.t(ext('cartContinueShoppingButton'))}
          </Text>
        </Button>
        <Button
          style={style.button}
          onPress={onCheckoutPress}
          disabled={isBelowMinimumOrder}
        >
          <Text style={style.indicatorText}>
            {I18n.t(ext('cartCheckoutButton'), { totalPrice })}
          </Text>
        </Button>
      </View>
      <LinearGradient
        style={style.gradient}
        colors={style.gradientColors}
        locations={[0, 1]}
      />
    </View>
  );
}

CartFooterButtons.propTypes = {
  cartData: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onCheckoutPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

CartFooterButtons.defaultProps = {
  style: {},
};

export default connectStyle(ext('CartFooterButtons'))(CartFooterButtons);
