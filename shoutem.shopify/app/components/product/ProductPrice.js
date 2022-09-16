import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { ext } from '../../const';
import { formatPrice, getProductPrices } from '../../services';

function ProductPrice({
  product,
  isFeatured,
  currency,
  moneyFormat,
  secondary,
  style,
  wide,
}) {
  const { price, oldPrice } = useMemo(() => getProductPrices(product), [
    product,
  ]);

  const newPriceString = useMemo(
    () => formatPrice(price, currency, moneyFormat),
    [price, currency, moneyFormat],
  );

  const oldPriceString = useMemo(() => formatPrice(oldPrice, currency), [
    oldPrice,
    currency,
  ]);

  const showOldPrice = useMemo(() => !!oldPrice && price < oldPrice, [
    oldPrice,
    price,
  ]);

  const resolvedContainerStyle = useMemo(
    () => [style.container, wide && style.wideContainer],
    [wide, style],
  );

  const resolvedPriceStyle = useMemo(
    () => [style.price, isFeatured && style.featuredPrice],
    [isFeatured, style],
  );

  return (
    <View style={resolvedContainerStyle}>
      {secondary && showOldPrice && (
        <Text style={style.secondaryPrice}>{oldPriceString}</Text>
      )}
      <Text style={resolvedPriceStyle}>{newPriceString}</Text>
      {!secondary && showOldPrice && (
        <Text style={style.discountedPrice}>{oldPriceString}</Text>
      )}
    </View>
  );
}

ProductPrice.propTypes = {
  currency: PropTypes.string.isRequired,
  moneyFormat: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  isFeatured: PropTypes.bool,
  secondary: PropTypes.bool,
  style: PropTypes.object,
  wide: PropTypes.bool,
};

ProductPrice.defaultProps = {
  isFeatured: false,
  secondary: false,
  style: {},
  wide: false,
};

export default connectStyle(ext('ProductPrice'))(React.memo(ProductPrice));
