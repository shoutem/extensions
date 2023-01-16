import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { EmptyListImage,  Screen, Spinner } from '@shoutem/ui';
import { loginRequired } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { OrderListItem } from '../components/order';
import { ext } from '../const';
import { actions, selectors } from '../redux';

function OrderHistoryScreen({ style }) {
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const orders = useSelector(selectors.getOrders);
  const loading = useSelector(selectors.getOrdersLoading);
  const isLoggedIn = useSelector(selectors.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(actions.loadOrders());
    }
  }, [dispatch, isLoggedIn]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    if (isLoggedIn) {
      dispatch(actions.loadOrders());
    }

    setRefreshing(false);
  }, [dispatch, isLoggedIn]);

  const handleEndReached = useCallback(() => {
    if (isLoggedIn) {
      dispatch(actions.loadNextOrders());
    }
  }, [dispatch, isLoggedIn]);

  const renderOrder = useCallback(({ item }) => {
    const handlePress = () =>
      navigateTo(ext('OrderDetailsScreen'), { orderNumber: item.orderNumber });

    return <OrderListItem order={item} onPress={handlePress} />;
  }, []);

  const renderListEmptyComponent = useMemo(() => {
    if (!loading) {
      return (
        <EmptyListImage
          message={I18n.t(ext('emptyOrdersMessage'))}
          onRetry={handleRefresh}
        />
      );
    }

    return null;
  }, [handleRefresh, loading]);

  return (
    <Screen style={style.screen}>
      {loading && <Spinner style={style.spinner} />}
      <FlatList
        data={orders}
        renderItem={renderOrder}
        contentContainerStyle={style.container}
        ListEmptyComponent={renderListEmptyComponent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

OrderHistoryScreen.propTypes = {
  style: PropTypes.object.isRequired,
};

export default loginRequired(
  connectStyle(ext('OrderHistoryScreen'))(OrderHistoryScreen),
);
