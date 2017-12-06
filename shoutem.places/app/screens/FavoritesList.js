import { connectStyle } from '@shoutem/theme';
import React from 'react';
import { LayoutAnimation } from 'react-native';
import { FavoritesListScreen } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Button,
  View,
  Text,
} from '@shoutem/ui';

import MapList from '../components/MapList';
import PlacePhotoView from '../components/PlacePhotoView';
import { ext } from '../const';

export class FavoritesList extends FavoritesListScreen {
  static propTypes = {
    ...FavoritesListScreen.PropTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.renderData = this.renderData.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.toggleMapView = this.toggleMapView.bind(this);
    this.renderFavorite = this.renderFavorite.bind(this);
    this.shouldRenderMap = this.shouldRenderMap.bind(this);
    this.state = {
      ...this.state,
      schema: ext('places'),
      mapView: false,
    };
  }

  componentWillReceiveProps(newProps) {
    const { favorites } = newProps;

    if (!this.shouldRenderMap(favorites)) {
      this.setState({ mapView: false });
    }
  }

  shouldRenderMap(favorites) {
    const { mapView } = this.state;

    return (!_.isEmpty(favorites) && mapView);
  }

  getNavBarProps() {
    const { title } = this.props;

    return {
      title,
      renderRightComponent: () => this.renderRightNavBarComponent(),
    };
  }

  renderFavorite(place) {
    return <PlacePhotoView place={place} />;
  }

  toggleMapView() {
    const { mapView } = this.state;

    LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  renderRightNavBarComponent() {
    const { mapView } = this.state;
    const { favorites } = this.props;

    const actionText = mapView ? I18n.t('shoutem.cms.navBarListViewButton') : I18n.t('shoutem.cms.navBarMapViewButton');

    if (_.isEmpty(favorites)) {
      return null;
    }

    return (
      <View virtual styleName="container md-gutter-right">
        <Button
          styleName="tight"
          onPress={this.toggleMapView}
        >
          <Text>{actionText}</Text>
        </Button>
      </View>
    );
  }

  renderData(favorites) {
    if (this.shouldRenderMap(favorites)) {
      return (
        <MapList
          places={favorites}
        />
      );
    }
    return super.renderData(favorites);
  }
}

export const mapStateToProps = FavoritesListScreen.createMapStateToProps(
  ext('places'),
  (state) => state[ext()].allPlaces,
);

export const mapDispatchToProps = FavoritesListScreen.createMapDispatchToProps();

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('FavoritesList'), {})(FavoritesList)
);
