import React, { useEffect, useMemo } from 'react';
import { LayoutAnimation } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Spinner, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import { centsToDollars, useCartPriceBreakdown } from '../../services';

export function OrderInformation({ cartData, loading, style, withBorder }) {
  useEffect(() => LayoutAnimation.easeInEaseOut, [loading]);

  const {
    productsWithoutTaxes,
    isBelowMinimumOrder,
    taxesTotal,
    feesTotal,
    totalPrice,
    discount,
    totalPriceWithoutDiscount,
  } = useCartPriceBreakdown(cartData);

  const containerStyle = useMemo(
    () =>
      withBorder
        ? [style.container, style.containerWithBorder]
        : style.container,
    [withBorder, style.container, style.containerWithBorder],
  );

  const showDiscount = Number.parseFloat(discount) > 0;

  return (
    <View style={containerStyle}>
      <View>
        <View style={style.row}>
          <Text style={style.title}>{I18n.t(ext('cartOrderTotal'))}</Text>
          {!loading && (
            <View styleName="horizontal">
              {showDiscount && (
                <Text style={[style.title, style.discountTitle]}>
                  {`$${totalPriceWithoutDiscount}`}
                </Text>
              )}
              <Text style={style.title}>{`$${totalPrice}`}</Text>
            </View>
          )}
          {loading && <Spinner />}
        </View>
        {isBelowMinimumOrder && (
          <Text style={style.error}>
            {I18n.t(ext('checkoutMinimumOrderAmountWarning'), {
              minimumSubtotal: centsToDollars(cartData.originSubtotalMinimum),
            })}
          </Text>
        )}
      </View>
      {!loading && (
        <>
          <View style={style.separator} />
          <View style={style.row}>
            <Text style={style.caption}>{I18n.t(ext('cartProducts'))}</Text>
            <Text style={style.caption}>{`$${productsWithoutTaxes}`}</Text>
          </View>
          <View style={style.row}>
            <Text style={style.caption}>{I18n.t(ext('cartTaxes'))}</Text>
            <Text style={style.caption}>{`$${taxesTotal}`}</Text>
          </View>
          {_.map(cartData.taxes, tax => (
            <View style={style.subRow} key={tax.name}>
              <Text style={style.subCaption}>{tax.name}</Text>
              <Text style={style.subCaption}>
                {`$${centsToDollars(tax.amount)}`}
              </Text>
            </View>
          ))}
          <View style={style.row}>
            <Text style={style.caption}>{I18n.t(ext('cartFees'))}</Text>
            <Text style={style.caption}>{`$${centsToDollars(feesTotal)}`}</Text>
          </View>
          {_.map(cartData.fee, fee => (
            <View style={style.subRow} key={fee.name}>
              <Text style={style.subCaption}>{fee.name}</Text>
              <Text style={style.subCaption}>
                {`$${centsToDollars(fee.amount)}`}
              </Text>
            </View>
          ))}
          {showDiscount && (
            <>
              <View style={style.row}>
                <Text style={style.caption}>
                  {I18n.t(ext('cartDiscounts'))}
                </Text>
                <Text style={style.caption}>{`$${discount}`}</Text>
              </View>
              {_.map(cartData.discounts, discount => (
                <View style={style.subRow} key={discount.name}>
                  <Text style={style.subCaption}>{discount.name}</Text>
                  <Text style={style.subCaption}>
                    {`$${centsToDollars(discount.discount)}`}
                  </Text>
                </View>
              ))}
            </>
          )}
        </>
      )}
    </View>
  );
}

OrderInformation.propTypes = {
  cartData: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  style: PropTypes.object,
  withBorder: PropTypes.bool,
};

OrderInformation.defaultProps = {
  loading: false,
  withBorder: false,
  style: {},
};

export default connectStyle(ext('OrderInformation'))(OrderInformation);
