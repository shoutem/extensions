import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { currentLocation } from 'shoutem.cms';
import { PlaceIconView } from '../components';
import { ext } from '../const';
import { mapDispatchToProps, mapStateToProps, PlacesList } from './PlacesList';

class PlacesListWithIcons extends PlacesList {
  static propTypes = {
    ...PlacesList.propTypes,
  };

  renderRow(place) {
    return <PlaceIconView place={place} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  connectStyle(ext('PlacesListWithIcons'))(
    currentLocation(PlacesListWithIcons),
  ),
);
