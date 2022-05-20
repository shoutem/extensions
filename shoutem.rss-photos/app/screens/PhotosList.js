import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import ListPhotoView from '../components/ListPhotoView';
import { ext } from '../const';
import {
  mapDispatchToProps,
  mapStateToProps,
  PhotosBaseScreen,
} from './PhotosBaseScreen';

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

  renderData() {
    const { photos } = this.state;
    // We're overriding renderData method by providing it
    // filtered and remaped photos (from state)
    return super.renderData(photos);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PhotosList'))(PhotosList));
