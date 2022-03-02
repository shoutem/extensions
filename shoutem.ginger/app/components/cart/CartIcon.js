import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Text, TouchableOpacity, View } from '@shoutem/ui';
import { navigateTo } from 'shoutem.navigation';
import { ext } from '../../const';
import { getCartProducts } from '../../redux';

export function CartIcon({ style, tintColor }) {
  const products = useSelector(getCartProducts);

  const productCount = _.size(products);
  const showNumberIndicator = useMemo(() => productCount > 0, [productCount]);

  const handleIconPress = useCallback(() => navigateTo(ext('CartScreen')), []);

  return (
    <TouchableOpacity onPress={handleIconPress}>
      <Icon name="ginger-cart" fill={tintColor?.color} />
      {showNumberIndicator && (
        <View style={style.outerContainer}>
          <View style={style.innerContainer}>
            <Text style={style.indicatorText}>{productCount}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

CartIcon.propTypes = {
  style: PropTypes.object,
  tintColor: PropTypes.object,
};

CartIcon.defaultProps = {
  style: {},
  tintColor: undefined,
};

export default connectStyle(ext('CartIcon'))(CartIcon);
