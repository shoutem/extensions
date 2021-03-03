import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow } from '@shoutem/ui';
import FixedGridPhotoView from '../components/FixedGridPhotoView';
import { ext } from '../const';
import {
  PhotosBaseScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosBaseScreen';

const NUMBER_OF_COLUMNS = 2;

class FixedGridPhotosScreen extends PhotosBaseScreen {
  static propTypes = {
    ...PhotosBaseScreen.propTypes,
  };

  renderRow(photos) {
    const photoViews = _.map(photos, photo => {
      return (
        <FixedGridPhotoView
          key={photo.id}
          photo={photo}
          onPress={this.openDetailsScreen}
        />
      );
    });

    return (
      <GridRow columns={NUMBER_OF_COLUMNS} key={photos[0].id}>
        {photoViews}
      </GridRow>
    );
  }

  renderData() {
    const { photos } = this.state;

    const groupedPhotos = GridRow.groupByRows(photos, NUMBER_OF_COLUMNS);
    cloneStatus(photos, groupedPhotos);

    return super.renderData(groupedPhotos);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FixedGridPhotosScreen'))(FixedGridPhotosScreen));
