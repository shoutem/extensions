import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { getScreenState } from 'shoutem.cms';
import { closeModal, navigateTo, openInModal } from 'shoutem.navigation';
import FeaturedItem from '../components/FeaturedItem';
import GridItem from '../components/GridItem';
import { ext } from '../const';
import { selectors } from '../redux';
import { cartItemAdded } from '../redux/actionCreators';
import { CART_ACTION_TYPES } from '../redux/actionTypes';
import { getCurrentItem, mapDataFor122Layout } from '../services';
import ProductsLayout from './ProductsLayout';

function Grid122Products({
  hasFeaturedItem,
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

  const { products } = useSelector(state =>
    selectors.getProducts(state, resolvedCollectionId),
  );

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

  const groupedProducts = useMemo(() => mapDataFor122Layout(products), [
    products,
  ]);

  function renderFeaturedProduct(item) {
    const resolvedItem = getCurrentItem(item);

    if (_.isEmpty(item)) {
      return null;
    }

    return (
      <FeaturedItem
        item={resolvedItem}
        onAddToCart={handleAddToCart}
        onPress={() => navigateToProductDetails(resolvedItem)}
        shop={shop}
      />
    );
  }

  function renderProductRow(products) {
    if (products[0].isFeatured) {
      return _.map(products, renderFeaturedProduct);
    }

    const gridProducts = _.map(products, item => (
      <GridItem
        item={item}
        key={item.id}
        onAddToCart={handleAddToCart}
        onPress={() => navigateToProductDetails(item)}
        shop={shop}
      />
    ));

    return <GridRow columns={2}>{gridProducts}</GridRow>;
  }

  return (
    <ProductsLayout
      hasFeaturedItem={hasFeaturedItem}
      groupedProducts={groupedProducts}
      renderRow={renderProductRow}
      screenId={screenId}
      selectedCollections={selectedCollections}
      tag={tag}
    />
  );
}

Grid122Products.propTypes = {
  hasFeaturedItem: PropTypes.bool.isRequired,
  screenId: PropTypes.string.isRequired,
  selectedCollections: PropTypes.array.isRequired,
  tag: PropTypes.string,
};

Grid122Products.defaultProps = {
  tag: null,
};

export default connectStyle(ext('Grid122Products'))(Grid122Products);
