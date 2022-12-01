import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, View } from '@shoutem/ui';
import { ext } from '../../const';
import { selectors } from '../../redux';
import { formatPrice } from '../../services';

function QuickAddItemDetails({ image, style, variant, description, quantity }) {
  const { currency, moneyFormat } = useSelector(selectors.getShopState);

  const price = useMemo(
    () => formatPrice(variant?.price * quantity, currency, moneyFormat),
    [variant?.price, currency, moneyFormat, quantity],
  );
  const oldPrice = useMemo(
    () =>
      formatPrice(variant?.compareAtPrice * quantity, currency, moneyFormat),
    [variant?.compareAtPrice, currency, moneyFormat, quantity],
  );

  return (
    <View style={style.container}>
      <Image source={image} style={style.image} />
      <View style={style.contentContainer}>
        <View style={style.innerContentContainer}>
          <View style={style.textContainer}>
            <Text style={style.detailsText} numberOfLines={3}>
              {description}
            </Text>
          </View>
          <View style={style.priceContainer}>
            {variant?.compareAtPrice && (
              <Text style={[style.newPrice, style.oldPrice]}>{oldPrice}</Text>
            )}
            <Text style={style.newPrice}>{price}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

QuickAddItemDetails.propTypes = {
  image: PropTypes.any.isRequired,
  quantity: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  description: PropTypes.string,
  variant: PropTypes.object,
};

QuickAddItemDetails.defaultProps = {
  description: '',
  variant: undefined,
};
export default connectStyle(ext('QuickAddItemDetails'))(QuickAddItemDetails);
