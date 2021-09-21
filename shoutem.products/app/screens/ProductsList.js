import React from 'react';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { CmsListScreen } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import { openURL } from 'shoutem.web-view';
import { connectStyle } from '@shoutem/theme';
import ListProductView from '../components/ListProductView';
import { ext } from '../const';

export class ProductsList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('Products'),
    };
  }

  openDetailsScreen(product) {
    navigateTo(ext('ProductDetails'), { product });
  }

  renderRow(product) {
    return (
      <ListProductView product={product} onPress={this.openDetailsScreen} />
    );
  }
}

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
