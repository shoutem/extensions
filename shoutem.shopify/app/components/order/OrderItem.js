import React from 'react';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, Row, Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { images as imageAssets } from '../../assets';
import { ext } from '../../const';

function OrderItem({ item, style }) {
  const { title, currentQuantity, variant } = item;

  const orderImage = { uri: variant.image?.url };
  const variantTitle = variant?.title;

  const quantity = `${currentQuantity} ${pluralize(
    I18n.t(ext('pieces')),
    currentQuantity,
  )}`;

  return (
    <Row style={style.itemContainer}>
      <Image
        style={style.image}
        source={orderImage}
        defaultSource={imageAssets.fallback}
      />
      <View style={style.mainContainer}>
        <View style={style.orderContainer}>
          <Text numberOfLines={2}>{title}</Text>
          {!!variantTitle && (
            <Text numberOfLines={1} style={style.variantTitle}>
              {variantTitle}
            </Text>
          )}
          <Text>{quantity}</Text>
        </View>
        <Text style={style.price}>{item.originalTotalPrice.displayValue}</Text>
      </View>
    </Row>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default connectStyle(ext('OrderItem'))(OrderItem);
