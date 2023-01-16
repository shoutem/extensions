import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Text, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../../const';
import OrderItem from './OrderItem';

function OrderItems({ items, onEndReached, style }) {
  const renderItem = useCallback(
    ({ item }) => <OrderItem item={item} key={item?.variant?.id} />,
    [],
  );

  return (
    <View style={style.container}>
      <Text style={style.title}>{I18n.t(ext('items'))}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        onEndReached={onEndReached}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

OrderItems.propTypes = {
  items: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
  onEndReached: PropTypes.func.isRequired,
};

export default connectStyle(ext('OrderItems'))(OrderItems);
