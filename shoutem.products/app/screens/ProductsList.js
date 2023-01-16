import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import { CmsListScreen } from 'shoutem.cms';
import { getRouteParams, navigateTo } from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { ListProductView } from '../components';
import { ext } from '../const';

export class ProductsList extends CmsListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('Products'),
    };
  }

  openDetailsScreen(product) {
    const {
      shortcut: {
        settings: { addAuthHeaderToBuyLink },
      },
    } = getRouteParams(this.props);

    navigateTo(ext('ProductDetails'), {
      addAuthHeaderToBuyLink,
      product,
      analyticsPayload: {
        itemId: product.id,
        itemName: product.name,
      },
    });
  }

  renderRow(product) {
    return (
      <ListProductView product={product} onPress={this.openDetailsScreen} />
    );
  }
}

ProductsList.propTypes = {
  ...CmsListScreen.propTypes,
};

ProductsList.defaultProps = {
  ...CmsListScreen.defaultProps,
};

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestProducts,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  openURL,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ProductsList'), {})(ProductsList));
