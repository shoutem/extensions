import React from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Text, TouchableOpacity, View } from '@shoutem/ui';
import { authenticate } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { getProductPrice, getProductSubtitle } from '../services';
import LoadingButton from './LoadingButton';

export function LargeProductListItem({ product, onPress, onBuyPress, style }) {
  const dispatch = useDispatch();

  const subtitle = getProductSubtitle(product);
  const price = getProductPrice(product);

  function handlePress() {
    if (onPress) {
      onPress(product);
    }
  }

  function handleBuyPress() {
    return new Promise((resolve, reject) => {
      dispatch(
        authenticate(
          () =>
            onBuyPress(product.skuId)
              .then(resolve)
              .catch(reject),
          reject,
        ),
      );
    });
  }

  return (
    <TouchableOpacity style={style.container} onPress={handlePress}>
      <Text style={style.title} numberOfLines={2}>
        {product.name}
      </Text>
      <Image source={{ uri: _.head(product.images) }} style={style.image} />
      <View style={style.textContainer}>
        <Text style={style.subtitle}>{subtitle}</Text>
        <Text style={style.price}>{price}</Text>
      </View>
      <LoadingButton
        containerStyle={style.button}
        onPress={handleBuyPress}
        withSuccessStates
        iconName="ginger-cart"
        label={I18n.t(ext('addToCart'))}
      />
    </TouchableOpacity>
  );
}

LargeProductListItem.propTypes = {
  product: PropTypes.object.isRequired,
  onBuyPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

LargeProductListItem.defaultProps = {
  style: {},
  onPress: undefined,
};

export default React.memo(
  connectStyle(ext('LargeProductListItem'))(LargeProductListItem),
);
