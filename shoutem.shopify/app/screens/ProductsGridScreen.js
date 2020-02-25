import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import {
  ProductsListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ProductsListScreen';

import ProductsGrid from '../components/ProductsGrid';
import { ext } from '../const';

/**
 * Allows users to browse through products arranged in a grid view.
 */
class ProductsGridScreen extends ProductsListScreen {
  static propTypes = {
    ...ProductsListScreen.propTypes,
  };

  getNavBarProps() {
    return { ...super.getNavBarProps(), styleName: 'featured' };
  }

  renderCollectionsPicker() {
    return super.renderCollectionsPicker('horizontal featured');
  }

  /* eslint-disable class-methods-use-this */
  renderProducts(collectionId) {
    const { listType } = this.props;

    const isTallGrid = listType === 'tall-grid';

    return (
      <ProductsGrid collectionId={collectionId} isTall={isTallGrid} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ProductsGridScreen'), {})(ProductsGridScreen),
);
