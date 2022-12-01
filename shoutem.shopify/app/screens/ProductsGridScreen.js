import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { getRouteParams } from 'shoutem.navigation';
import ProductsGrid from '../components/ProductsGrid';
import { ext } from '../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  ProductsListScreen,
} from './ProductsListScreen';

/**
 * Allows users to browse through products arranged in a grid view.
 */
class ProductsGridScreen extends ProductsListScreen {
  static propTypes = {
    ...ProductsListScreen.propTypes,
  };

  /* eslint-disable class-methods-use-this */
  renderProducts(collectionId) {
    const { screenSettings } = getRouteParams(this.props);
    const isTallGrid = screenSettings.listType === 'tall-grid';

    return (
      <ProductsGrid
        collectionId={collectionId}
        isTall={isTallGrid}
        onQuickAddPress={this.handleQuickBuyPress}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductsGridScreen'), {})(ProductsGridScreen));
