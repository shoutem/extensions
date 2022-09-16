import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Subtitle, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { selectors } from '../../redux';
import { formatPrice } from '../../services/currency';
import { shop as shopShape } from '../shapes';

function CartFooter({
  action,
  cartTotal,
  shop: { currency, moneyFormat },
  onActionButtonClicked,
}) {
  const total = useMemo(() => formatPrice(cartTotal, currency, moneyFormat), [
    cartTotal,
    currency,
    moneyFormat,
  ]);

  return (
    <View>
      <View styleName="horizontal md-gutter space-between">
        <Subtitle>{I18n.t(ext('totalPrice'))}</Subtitle>
        <Subtitle>{total}</Subtitle>
      </View>
      {!!action && (
        <View styleName="horizontal h-end md-gutter sm-gutter-top">
          <Button onPress={onActionButtonClicked} styleName="secondary">
            <Text styleName="bold">{action}</Text>
          </Button>
        </View>
      )}
    </View>
  );
}

CartFooter.propTypes = {
  cartTotal: PropTypes.string.isRequired,
  shop: shopShape.isRequired,
  onActionButtonClicked: PropTypes.func.isRequired,
  action: PropTypes.string,
};

CartFooter.defaultProps = {
  action: null,
};

const mapStateToProps = state => {
  const { shop } = state[ext()];

  return {
    cartTotal: selectors.getCartTotal(state),
    shop,
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('CartFooter'))(CartFooter),
);
