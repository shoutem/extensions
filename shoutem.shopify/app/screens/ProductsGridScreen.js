import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { composeNavigationStyles, getRouteParams } from 'shoutem.navigation';
import ProductsGrid from '../components/ProductsGrid';
import {
  ProductsListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ProductsListScreen';
import { ext } from '../const';

/**
 * Allows users to browse through products arranged in a grid view.
 */
class ProductsGridScreen extends ProductsListScreen {
  static propTypes = {
    ...ProductsListScreen.propTypes,
  };

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      ...composeNavigationStyles(['featured']),
    };
  }

  renderCollectionsPicker() {
    return super.renderCollectionsPicker('horizontal featured');
  }

  /* eslint-disable class-methods-use-this */
  renderProducts(collectionId) {
    const { screenSettings } = getRouteParams(this.props);
    const isTallGrid = screenSettings.listType === 'tall-grid';

    return <ProductsGrid collectionId={collectionId} isTall={isTallGrid} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductsGridScreen'), {})(ProductsGridScreen));
