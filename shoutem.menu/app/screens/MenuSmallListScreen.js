import React from 'react';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { connectStyle } from '@shoutem/theme';
import SmallListMenuView from '../components/SmallListMenuView';
import { ext } from '../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  MenuListScreen,
} from './MenuListScreen';

class MenuSmallListScreen extends MenuListScreen {
  constructor(props, context) {
    super(props, context);

    autoBindReact(this);
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
