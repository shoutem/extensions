import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { getScreenState } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import MediumListItem from '../components/MediumListItem';
import { ext } from '../const';
import { selectors } from '../redux';
import { getCurrentItem } from '../services';
import ProductsLayout from './ProductsLayout';

function MediumListProducts({
  onQuickAddPress,
  hasFeaturedItem,
  screenId,
  selectedCollections,
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
    return (
      <MediumListItem
        item={item}
        key={item.id}
        onAddToCart={() => onQuickAddPress(item)}
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

MediumListProducts.propTypes = {
  hasFeaturedItem: PropTypes.bool.isRequired,
  screenId: PropTypes.string.isRequired,
  selectedCollections: PropTypes.array.isRequired,
  onQuickAddPress: PropTypes.func.isRequired,
  tag: PropTypes.string,
};

MediumListProducts.defaultProps = {
  tag: null,
};

export default connectStyle(ext('MediumListProducts'))(MediumListProducts);
