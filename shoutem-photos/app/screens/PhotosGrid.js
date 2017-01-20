import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

import {
  GridRow,
  View
} from '@shoutem/ui';

import {
  PhotosList,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosList';

import { cloneStatus } from '@shoutem/redux-io';
import GridPhotoView from '../components/GridPhotoView';

const numberOfImagesInColumn = 3;

class PhotosGrid extends PhotosList {
  static propTypes = {
    ...PhotosList.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      width: 0,
      height: 0,
    }
  }

  renderRow(photos) {   

    // Render the GridPhotoView within a GridRow for all
    // photos  
    const photoViews = _.map(photos, (photo) => {
      return (
        <View key={photo.id} onLayout={(event)=>{
            if (this.state.width !== event.nativeEvent.layout.width){
              this.setState({
                width: event.nativeEvent.layout.width, 
                height: event.nativeEvent.layout.width
              });
            }
        }}>
          <GridPhotoView
            photo={photo}
            onPress={this.openDetailsScreen}
            width={this.state.width}
            height={this.state.height}
          />
        </View>
      );
    });
    return (
      <GridRow 
          columns={numberOfImagesInColumn}
          key={photos[0].id}>
        {photoViews}
      </GridRow>
    );
  }

  renderPhotos(photos){
      const groupedPhotos = GridRow.groupByRows(photos, numberOfImagesInColumn);

      cloneStatus(photos, groupedPhotos);

      return (
          <View style={style.grid}>
            {super.renderPhotos(groupedPhotos)}
          </View>
        );
  }

}

const style = {
  grid: {
    margin: 15,
    flex: 1,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PhotosGrid'), style)(PhotosGrid)
);
