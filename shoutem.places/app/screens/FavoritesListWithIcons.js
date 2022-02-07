import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { PlaceIconView } from '../components';
import { ext } from '../const';
import {
  FavoritesList,
  mapDispatchToProps,
  mapStateToProps,
} from './FavoritesList';

class FavoritesListWithIcons extends FavoritesList {
  static propTypes = {
    ...FavoritesList.propTypes,
  };

  renderFavorite(place) {
    return <PlaceIconView place={place} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FavoritesListWithIcons'))(FavoritesListWithIcons));
