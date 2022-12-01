import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { getScreenState } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import LargeListItem from '../components/LargeListItem';
import { ext } from '../const';
import { selectors } from '../redux';
import { getCurrentItem } from '../services';
import ProductsLayout from './ProductsLayout';

function LargeListProducts({
  hasFeaturedItem,
  screenId,
  selectedCollections,
  onQuickAddPress,
  tag,
}) {
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

  function renderProductRow(item) {
    const resolvedItem = getCurrentItem(item);

    return (
      <LargeListItem
        item={item}
        isFixed
        key={item.id}
        onAddToCart={() => onQuickAddPress(resolvedItem)}
        onPress={() => navigateToProductDetails(item)}
        shop={shop}
      />
    );
  }

  return (
    <ProductsLayout
      hasFeaturedItem={hasFeaturedItem}
      groupedProducts={products}
      renderRow={renderProductRow}
      screenId={screenId}
      selectedCollections={selectedCollections}
      tag={tag}
      onQuickAddPress={onQuickAddPress}
    />
  );
}

LargeListProducts.propTypes = {
  hasFeaturedItem: PropTypes.bool.isRequired,
  screenId: PropTypes.string.isRequired,
  selectedCollections: PropTypes.array.isRequired,
  onQuickAddPress: PropTypes.func.isRequired,
  tag: PropTypes.string,
};

LargeListProducts.defaultProps = {
  tag: null,
};

export default connectStyle(ext('LargeListProducts'))(LargeListProducts);
