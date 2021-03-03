import React from 'react';
import { connect } from 'react-redux';
import { currentLocation } from 'shoutem.cms';
import { connectStyle } from '@shoutem/theme';
import PlaceIconView from '../components/PlaceIconView';
import { ext } from '../const';
import { PlacesList, mapStateToProps, mapDispatchToProps } from './PlacesList';

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
