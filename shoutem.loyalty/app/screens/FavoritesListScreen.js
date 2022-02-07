import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { getCollection } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { FavoritesListScreen } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderTextButton } from 'shoutem.navigation';
import MapList from '../components/MapList';
import PlaceIconView from '../components/PlaceIconView';
import { ext } from '../const';
import { refreshCardState } from '../services';

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

  componentDidMount() {
    const {
      favoriteCollection,
      fetchFavoritesData,
      itemsLoaded,
      refreshCardState,
    } = this.props;
    const { schema } = this.state;

    if (!itemsLoaded) {
      this.toggleLoading();

      fetchFavoritesData(schema, favoriteCollection)
        .then(refreshCardState)
        .then(this.toggleLoading);
    }
  }

  shouldRenderMap(favorites) {
    const { mapView } = this.state;

    return !_.isEmpty(favorites) && mapView;
  }

  getNavBarProps() {
    const { title } = getRouteParams(this.props);

    return {
      title,
      headerRight: this.renderRightNavBarComponent,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  renderFavorite(place) {
    const { cardStatesByLocation } = this.props;

    const placeId = _.get(place, 'id');
    const points = _.get(cardStatesByLocation[placeId], 'points');

    return <PlaceIconView place={place} points={points} />;
  }

  toggleMapView() {
    const { mapView } = this.state;

    LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  renderRightNavBarComponent(props) {
    const { mapView } = this.state;
    const { favorites } = this.props;

    const actionText = mapView
      ? I18n.t('shoutem.cms.navBarListViewButton')
      : I18n.t('shoutem.cms.navBarMapViewButton');

    if (_.isEmpty(favorites)) {
      return null;
    }

    return (
      <HeaderTextButton
        {...props}
        onPress={this.toggleMapView}
        title={actionText}
      />
    );
  }

  renderData(favorites) {
    if (this.shouldRenderMap(favorites)) {
      return <MapList places={favorites} />;
    }

    return super.renderData(favorites);
  }
}

export const mapStateToProps = state => {
  const cardStates = getCollection(state[ext()].allCardStates, state);

  return {
    ...FavoritesListScreen.createMapStateToProps(
      ext('places'),
      state => state[ext()].locations,
    )(state),
    cardStatesByLocation: _.keyBy(cardStates, 'location'),
  };
};
export const mapDispatchToProps = FavoritesListScreen.createMapDispatchToProps({
  refreshCardState,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FavoritesList'), {})(FavoritesList));
