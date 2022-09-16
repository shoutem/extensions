import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { DropDownMenu, ListView, Screen, Spinner } from '@shoutem/ui';
import { getScreenState, setScreenState } from 'shoutem.cms';
import { closeModal, navigateTo, openInModal } from 'shoutem.navigation';
import FeaturedItem from '../components/FeaturedItem';
import { ext, PAGE_SIZE } from '../const';
import { selectors } from '../redux';
import { cartItemAdded, refreshProducts } from '../redux/actionCreators';
import { CART_ACTION_TYPES } from '../redux/actionTypes';
import { getCurrentItem } from '../services';

function ProductsLayout({
  groupedProducts,
  hasFeaturedItem,
  renderRow,
  screenId,
  selectedCollections,
  tag,
}) {
  const dispatch = useDispatch();

  const shop = useSelector(selectors.getShopState);

  const { collectionId } = useSelector(state =>
    getScreenState(state, screenId),
  );
  const collections = useSelector(state =>
    selectors.getCollectionsVisibleInShortcut(state, selectedCollections),
  );

  const resolvedCollectionId = useMemo(
    () => collectionId || collections[0].id,
    [collectionId, collections],
  );

  const { isLoading: shopLoading } = useSelector(selectors.getShopState);

  const { isLoading: productsLoading, products } = useSelector(state =>
    selectors.getProducts(state, resolvedCollectionId),
  );

  const loading = useMemo(() => productsLoading || shopLoading, [
    productsLoading,
    shopLoading,
  ]);

  const navigateToProductDetails = useCallback(item => {
    const resolvedItem = getCurrentItem(item);

    navigateTo(ext('ProductDetailsScreen'), {
      productId: resolvedItem.id,
    });
  }, []);

  const addItemToCart = useCallback(
    (item, variant, quantity) => {
      dispatch(cartItemAdded({ item, variant, quantity }));
      closeModal();
    },
    [dispatch],
  );

  const handleAddToCart = useCallback(
    item => {
      const resolvedItem = getCurrentItem(item);

      const routeParams = {
        actionType: CART_ACTION_TYPES.ADD,
        item: resolvedItem,
        onActionButtonClicked: (type, { variant, quantity }) =>
          addItemToCart(resolvedItem, variant, quantity),
      };

      openInModal(ext('UpdateItemScreen'), routeParams);
    },
    [addItemToCart],
  );

  function renderFeaturedProduct(item) {
    const resolvedItem = getCurrentItem(item);

    if (_.isEmpty(item)) {
      return null;
    }

    return (
      <FeaturedItem
        item={resolvedItem}
        onAddToCart={() => handleAddToCart(item)}
        onPress={() => navigateToProductDetails(resolvedItem)}
        shop={shop}
      />
    );
  }

  const handleLoadMore = useCallback(() => {
    if (_.size(products) < PAGE_SIZE) {
      return;
    }

    dispatch(refreshProducts(collectionId, null, false));
  }, [dispatch, collectionId, products]);

  const handleRefresh = useCallback(() => {
    dispatch(refreshProducts(collectionId, tag, true));
  }, [dispatch, collectionId, tag]);

  return (
    <ListView
      data={groupedProducts}
      loading={loading}
      onLoadMore={handleLoadMore}
      onRefresh={handleRefresh}
      renderRow={renderRow}
      hasFeaturedItem={hasFeaturedItem}
      renderFeaturedItem={renderFeaturedProduct}
      scrollIndicatorInsets={{ right: 1 }}
    />
  );
}

ProductsLayout.propTypes = {
  groupedProducts: PropTypes.array.isRequired,
  hasFeaturedItem: PropTypes.bool.isRequired,
  renderRow: PropTypes.func.isRequired,
  screenId: PropTypes.string.isRequired,
  selectedCollections: PropTypes.array.isRequired,
  tag: PropTypes.string,
};

ProductsLayout.defaultProps = {
  tag: null,
};

export default connectStyle(ext('ProductsLayout'))(ProductsLayout);
