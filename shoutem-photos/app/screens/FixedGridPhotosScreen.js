import React from 'react';
import { Dimensions } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { cloneStatus } from '@shoutem/redux-io';
import {
  connectStyle,
  getSizeRelativeToReference,
} from '@shoutem/theme';

import {
  GridRow,
  View,
} from '@shoutem/ui';

import { ext } from '../const';

import {
  PhotosBaseScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosBaseScreen';

import FixedGridPhotoView from '../components/FixedGridPhotoView';

const window = Dimensions.get('window');

const NUMBER_OF_COLUMNS = 2;

class FixedGridPhotosScreen extends PhotosBaseScreen {
  static propTypes = {
    ...PhotosBaseScreen.propTypes,
  };

  constructor(props) {
    super(props);
  }

  renderRow(photos) {
    const photoViews = _.map(photos, (photo) => {
      return (
        <FixedGridPhotoView key={photo.id} photo={photo} onPress={this.openDetailsScreen} />
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

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('FixedGridPhotosScreen'))(FixedGridPhotosScreen),
);
