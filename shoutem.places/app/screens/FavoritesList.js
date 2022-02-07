import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import { FavoritesListScreen } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderTextButton } from 'shoutem.navigation';
import { MapList, PlacePhotoView } from '../components';
import { ext } from '../const';
import { getAllPlaces } from '../redux';

export class FavoritesList extends FavoritesListScreen {
  static propTypes = {
    ...FavoritesListScreen.PropTypes,
  };

  static getDerivedStateFromProps(props, state) {
    const { favorites } = props;

    if (_.isEmpty(favorites)) {
      return { mapView: false };
    }

    return state;
  }

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      schema: ext('places'),
      mapView: false,
    };
  }

  shouldRenderMap(favorites) {
    const { mapView } = this.state;

    return !_.isEmpty(favorites) && mapView;
  }

  getNavBarProps() {
    const { title } = getRouteParams(this.props);

    return {
      headerRight: this.headerRight,
      title,
    };
  }

  headerRight(props) {
    const { favorites } = this.props;
    const { mapView } = this.state;

    if (_.isEmpty(favorites)) {
      return null;
    }

    const actionText = mapView
      ? I18n.t('shoutem.cms.navBarListViewButton')
      : I18n.t('shoutem.cms.navBarMapViewButton');

    return (
      <HeaderTextButton
        {...props}
        title={actionText}
        onPress={this.toggleMapView}
      />
    );
  }

  renderFavorite(place) {
    return <PlacePhotoView place={place} />;
  }

  toggleMapView() {
    const { mapView } = this.state;

    LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  renderData(favorites) {
    if (this.shouldRenderMap(favorites)) {
      return <MapList places={favorites} />;
    }

    return super.renderData(favorites);
  }
}

export const mapStateToProps = FavoritesListScreen.createMapStateToProps(
  ext('places'),
  getAllPlaces,
);

export const mapDispatchToProps = FavoritesListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FavoritesList'), {})(FavoritesList));
