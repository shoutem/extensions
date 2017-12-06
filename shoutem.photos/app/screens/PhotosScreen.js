import React from 'react';

import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';

import { ext } from '../const';
import {
  PhotosBaseScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosBaseScreen';

import { createListItem } from '../components/ListItemViewFactory';

export class PhotosScreen extends PhotosBaseScreen {
  static propTypes = {
    ...PhotosBaseScreen.propTypes,
  };

  renderRow(photo) {
    const { listType } = this.props;             

    return createListItem(listType, photo, this.openDetailsScreen);
  }

  renderData() {
    const { photos } = this.state;
    // We're overriding renderData method by providing it
    // filtered and remaped photos (from state)
    return super.renderData(photos);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PhotosScreen'))(PhotosScreen),
);
