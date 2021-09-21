import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';

import FeaturedItem from '../components/FeaturedItem';
import GridItem from '../components/GridItem';
import { ext } from '../const';
import {
  ProductsList,
  mapStateToProps,
  mapDispatchToProps,
} from './ProductsList';

/**
 * A component that displays products in a grid, with the first one featured.
 */
class ProductsGrid extends ProductsList {
  static propTypes = {
    ...ProductsList.propTypes,
  };

  renderProductRow(products, sectionId, index) {
    const gridProducts = _.map(products, product =>
      this.renderGridProduct(product),
    );

    return <GridRow columns={2}>{gridProducts}</GridRow>;
  }

  renderGridProduct(item) {
    const { isTall, shop } = this.props;

    return (
      <GridItem
        item={item}
        isTall={isTall}
        key={item.id}
        onAddToCart={() => this.onAddToCart(item)}
        onPress={() => this.navigateToProductDetails(item)}
        shop={shop}
      />
    );
  }

  renderProducts(products, isLoading) {
    const { hasFeaturedItem } = this.props;

    // Group the products into rows with 2 columns, except for the
    // first one, which is treated as a featured product
    let isFirstProduct = hasFeaturedItem;
    const groupedProducts = GridRow.groupByRows(products, 2, () => {
      if (isFirstProduct) {
        isFirstProduct = false;
        return 2;
      }

      return 1;
    });

    return super.renderProducts(groupedProducts, isLoading);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductsGrid'), {})(ProductsGrid));
