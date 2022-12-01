import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import { getScreenState } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import GridItem from '../components/GridItem';
import { ext } from '../const';
import { selectors } from '../redux';
import { getCurrentItem, mapDataForGridLayout } from '../services';
import ProductsLayout from './ProductsLayout';

function FixedGridProducts({
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

  function renderProductRow(products) {
    const gridProducts = _.map(products, item => (
      <GridItem
        item={item}
        isFixed
        key={item.id}
        onAddToCart={() => onQuickAddPress(item)}
        onPress={() => navigateToProductDetails(item)}
        shop={shop}
      />
    ));

    return <GridRow columns={2}>{gridProducts}</GridRow>;
  }

  const groupedProducts = useMemo(
    () => mapDataForGridLayout(products, hasFeaturedItem),
    [products, hasFeaturedItem],
  );

  return (
    <ProductsLayout
      hasFeaturedItem={hasFeaturedItem}
      groupedProducts={groupedProducts}
      renderRow={renderProductRow}
      screenId={screenId}
      selectedCollections={selectedCollections}
      tag={tag}
      onQuickAddPress={onQuickAddPress}
    />
  );
}

FixedGridProducts.propTypes = {
  hasFeaturedItem: PropTypes.bool.isRequired,
  screenId: PropTypes.string.isRequired,
  selectedCollections: PropTypes.array.isRequired,
  onQuickAddPress: PropTypes.func.isRequired,
  tag: PropTypes.string,
};

FixedGridProducts.defaultProps = {
  tag: null,
};

export default connectStyle(ext('FixedGridProducts'))(FixedGridProducts);
