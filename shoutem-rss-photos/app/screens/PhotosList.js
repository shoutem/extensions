import React from 'react';

import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';

import {
  PhotosBaseScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosBaseScreen';

import { ext } from '../const';
import ListPhotoView from '../components/ListPhotoView';

export class PhotosList extends PhotosBaseScreen {
  static propTypes = {
    ...PhotosBaseScreen.propTypes,
  };

  renderRow(photo) {
    if (photo.source) {
      return (
        <ListPhotoView
          key={photo.id}
          photo={photo}
          onPress={this.openDetailsScreen}
        />
      );
    }
    return null;
  }

  renderFeed() {
    const { photos } = this.state;
    // We're overriding renderFeed method by providing it
    // filtered and remaped photos (from state)
    return super.renderFeed(photos);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PhotosList'))(PhotosList)
);

