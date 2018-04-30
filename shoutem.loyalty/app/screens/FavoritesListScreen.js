import React from 'react';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Button,
  View,
  Text,
} from '@shoutem/ui';
import { getCollection } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';

import { FavoritesListScreen } from 'shoutem.favorites';
import { I18n } from 'shoutem.i18n';

import MapList from '../components/MapList';
import PlaceIconView from '../components/PlaceIconView';
import { ext } from '../const';
import { refreshCardState } from '../services';

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

  componentWillMount() {
    const {
      refreshCardState,
      favoriteCollection,
      itemsLoaded,
    } = this.props;
    const { schema } = this.state;

    if (!itemsLoaded) {
      this.toggleLoading();

      this.props.fetchFavoritesData(schema, favoriteCollection)
        .then(refreshCardState)
        .then(this.toggleLoading);
    }
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
      // We use an arrow function here because otherwise the right component doesn't re-render
      renderRightComponent: () => this.renderRightNavBarComponent(),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  renderFavorite(place) {
    const { cardStatesByLocation } = this.props;

    const placeId = _.get(place, 'id');
    const points = _.get(cardStatesByLocation[placeId], 'points');

    return (
      <PlaceIconView
        place={place}
        points={points}
      />
    );
  }

  toggleMapView() {
    const { mapView } = this.state;

    LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  renderRightNavBarComponent() {
    const { mapView } = this.state;
    const { favorites } = this.props;

    const actionText = mapView ?
      I18n.t('shoutem.cms.navBarListViewButton') :
      I18n.t('shoutem.cms.navBarMapViewButton');

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

export const mapStateToProps = (state) => {
  const cardStates = getCollection(state[ext()].allCardStates, state);

  return {
    ...FavoritesListScreen.createMapStateToProps(ext('places'), state => state[ext()].locations)(state),
    cardStatesByLocation: _.keyBy(cardStates, 'location'),
  };
};
export const mapDispatchToProps = FavoritesListScreen.createMapDispatchToProps({
  refreshCardState,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('FavoritesList'), {})(FavoritesList),
);
