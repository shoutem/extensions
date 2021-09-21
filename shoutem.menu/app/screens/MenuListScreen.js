import React from 'react';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { CmsListScreen } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import ListMenuView from '../components/ListMenuView';
import { ext } from '../const';

export class MenuListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('Menu'),
    };
  }

  openDetailsScreen(item) {
    navigateTo(ext('MenuDetailsScreen'), {
      item,
    });
  }

  renderRow(item) {
    return (
      <ListMenuView
        item={item}
        onPress={this.openDetailsScreen}
        selectedCategoryId={this.props.selectedCategory.id}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].allMenuItems,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('MenuListScreen'), {})(MenuListScreen));
