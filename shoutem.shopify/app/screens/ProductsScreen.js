import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner, TabMenu, View } from '@shoutem/ui';
import { getScreenState, setScreenState } from 'shoutem.cms';
import {
  composeNavigationStyles,
  HeaderIconButton,
  navigateTo,
} from 'shoutem.navigation';
import { QuickAddModal } from '../components';
import { CartIcon } from '../components/cart';
import { ext } from '../const';
import { selectors } from '../redux';
import { cartItemAdded, refreshProducts } from '../redux/actionCreators';
import { resolveLayoutComponent } from '../services';

function ProductsScreen({
  navigation,
  route: {
    params: {
      screenId,
      tag = null,
      screenSettings: { hasFeaturedItem = false, listType },
      shortcut: {
        settings: { selectedCollections },
      },
    },
  },
}) {
  const dispatch = useDispatch();

  const { collectionId } = useSelector(state =>
    getScreenState(state, screenId),
  );
  const collections = useSelector(state =>
    selectors.getCollectionsVisibleInShortcut(state, selectedCollections),
  );

  const [quickAddVisible, setQuickAddvisible] = useState(false);
  const [quickAddItem, setQuickAddItem] = useState(undefined);

  const closeQuickAddModal = useCallback(() => {
    setQuickAddvisible(false);
    setQuickAddItem(undefined);
  }, []);

  const handleQuickBuyPress = useCallback(item => {
    setQuickAddItem(item);
    setQuickAddvisible(true);
  }, []);

  const handleAddToCart = useCallback(
    (variant, quantity) => {
      dispatch(cartItemAdded({ item: quickAddItem, variant, quantity })).then(
        () => {
          setQuickAddItem(null);
          setQuickAddvisible(false);
        },
      );
    },
    [dispatch, quickAddItem],
  );

  const resolvedCollectionId = useMemo(
    () => collectionId || collections[0]?.id,
    [collectionId, collections],
  );

  const currentCollection = useMemo(
    () => _.find(collections, { id: collectionId }) || collections[0],
    [collections, collectionId],
  );

  const cartSize = useSelector(selectors.getCartSize);

  const { isLoading: shopLoading } = useSelector(selectors.getShopState);

  const isCategoryPickerVisible = useMemo(() => _.size(collections) > 1, [
    collections,
  ]);

  const { isLoading: productsLoading } = useSelector(state =>
    selectors.getProducts(state, resolvedCollectionId),
  );

  const loading = useMemo(() => productsLoading || shopLoading, [
    productsLoading,
    shopLoading,
  ]);

  const navigateToSearchScreen = useCallback(() => {
    navigateTo(ext('SearchProductsScreen'), {
      collectionId: currentCollection.id,
    });
  }, [currentCollection]);

  const navigateToCart = useCallback(() => {
    navigateTo(ext('CartScreen'));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      ...(hasFeaturedItem && { ...composeNavigationStyles(['featured']) }),
      headerRight: navProps => {
        return (
          <View virtual styleName="horizontal">
            <HeaderIconButton
              iconName="search"
              onPress={navigateToSearchScreen}
              {...navProps}
            />
            <CartIcon
              cartSize={cartSize}
              onPress={navigateToCart}
              iconProps={{ style: navProps.tintColor }}
            />
          </View>
        );
      },
    });
  }, [
    cartSize,
    navigateToCart,
    navigateToSearchScreen,
    navigation,
    hasFeaturedItem,
  ]);

  function onCollectionSelected(collection) {
    if (currentCollection.id === collection.id) {
      return;
    }

    dispatch(
      setScreenState(screenId, {
        collectionId: collection.id,
      }),
    );

    dispatch(refreshProducts(collection.id));
  }

  const ResolvedLayoutComponent = useMemo(
    () => resolveLayoutComponent(listType),
    [listType],
  );

  return (
    <Screen>
      {isCategoryPickerVisible && (
        <TabMenu
          options={collections}
          onOptionSelected={onCollectionSelected}
          selectedOption={currentCollection || collections[0]}
        />
      )}
      {loading ? (
        <Spinner styleName="md-gutter-top" />
      ) : (
        <ResolvedLayoutComponent
          hasFeaturedItem={hasFeaturedItem}
          screenId={screenId}
          selectedCollections={selectedCollections}
          onQuickAddPress={handleQuickBuyPress}
          tag={tag}
        />
      )}
      <QuickAddModal
        visible={quickAddVisible}
        product={quickAddItem}
        onCancel={closeQuickAddModal}
        onSubmit={handleAddToCart}
      />
    </Screen>
  );
}

ProductsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default connectStyle(ext('ProductsScreen'))(ProductsScreen);
