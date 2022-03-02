import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Icon,
  Image,
  Spinner,
  Subtitle,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { getProductSubtitle } from '../services';

export function SmallProductListItem({ product, onPress, onBuyPress, style }) {
  const [loading, setIsLoading] = useState(false);

  const subtitle = getProductSubtitle(product);

  function handlePress() {
    if (onPress) {
      onPress(product);
    }
  }

  function handleBuyPress() {
    if (onBuyPress) {
      setIsLoading(true);
      onBuyPress(product.skuId).then(() => setIsLoading(false));
    }
  }

  return (
    <View style={style.container}>
      <TouchableOpacity onPress={handlePress} disabled={loading}>
        <View styleName="horizontal space-between">
          <View style={style.infoContainer}>
            <Text style={style.title}>{product.name}</Text>
            <Subtitle style={style.subtitle}>{subtitle}</Subtitle>
          </View>
          <Image source={{ uri: _.head(product.images) }} style={style.image} />
        </View>
      </TouchableOpacity>
      <Button
        disabled={loading}
        styleName="full-width"
        style={style.button}
        onPress={handleBuyPress}
      >
        {!loading && (
          <>
            <Icon name="ginger-cart" style={style.buttonIcon} />
            <Text style={style.buttonText}>{I18n.t(ext('addToCart'))}</Text>
          </>
        )}
        {loading && <Spinner style={style.spinner} />}
      </Button>
    </View>
  );
}

SmallProductListItem.propTypes = {
  product: PropTypes.object.isRequired,
  style: PropTypes.object,
  onBuyPress: PropTypes.func,
  onPress: PropTypes.func,
};

SmallProductListItem.defaultProps = {
  style: {},
  onPress: undefined,
  onBuyPress: undefined,
};

export default React.memo(
  connectStyle(ext('SmallProductListItem'))(SmallProductListItem),
);
