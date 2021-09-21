import React from 'react';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import SmallListMenuView from '../components/SmallListMenuView';
import { ext } from '../const';
import {
  MenuListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './MenuListScreen';

class MenuSmallListScreen extends MenuListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    // This propery changes dropdown position
    this.state.renderCategoriesInline = false;
  }

  renderRow(item) {
    return (
      <SmallListMenuView
        item={item}
        onPress={this.openDetailsScreen}
        selectedCategoryId={this.props.selectedCategory.id}
      />
    );
  }
}

export default connectStyle(ext('MenuSmallListScreen'))(
  connect(mapStateToProps, mapDispatchToProps)(MenuSmallListScreen),
);
