import PropTypes from 'prop-types';
import React from 'react';
import { LayoutAnimation, Alert } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  find,
  isBusy,
  isInitialized,
  getCollection,
} from '@shoutem/redux-io';
import {
  Button,
  ListView,
  Screen,
  Text,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

import { I18n } from 'shoutem.i18n';
import { loginRequired } from 'shoutem.auth';
import { NavigationBar } from 'shoutem.navigation';
import { CmsListScreen, currentLocation } from 'shoutem.cms';

import MapList from '../../components/MapList';
import PlaceIconView from '../../components/PlaceIconView';

import { refreshCardState } from '../../services';
import { ext } from '../../const';

/* eslint-disable class-methods-use-this, no-undef, react/forbid-prop-types */

const { func, object } = PropTypes;

/**
 * A base screen for displaying a list of loyalty places.
 */
export class PlacesList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    // A dictionary of card states with location as the key
    cardStatesByLocation: object,
    // Refreshes card state when it changes after a transaction
    refreshCardState: func,
  }

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderRightNavBarComponent = this.renderRightNavBarComponent.bind(this);
    this.toggleMapView = this.toggleMapView.bind(this);

    this.state = {
      ...this.state,
      schema: ext('places'),
      renderCategoriesInline: true,
      mapView: false,
    };
  }

  componentWillMount() {
    const { refreshCardState } = this.props;
    if (!this.state.schema) {
      throw Error(
        'Invalid Screen state "schema". Screen that extends CMSListScreen ' +
        'must define (content) "schema" property in the state.',
      );
    }

    super.refreshInvalidContent(this.props, true);
    refreshCardState();
  }

  refreshData() {
    super.refreshData();
    refreshCardState();
  }

  fetchData(options) {
    LayoutAnimation.easeInEaseOut();
    return super.fetchData(options);
  }

  toggleMapView() {
    const { mapView } = this.state;

    LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  renderRightNavBarComponent() {
    const { mapView } = this.state;
    const actionText = mapView ? I18n.t('shoutem.cms.navBarListViewButton') : I18n.t('shoutem.cms.navBarMapViewButton');

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

  promptForLocationPermission(message, confirmationMessage, onConfirmation) {
    const confirmOption = { text: confirmationMessage, onPress: onConfirmation };
    const cancelOption = { text: I18n.t(ext('cancelButton')) };
    const alertOptions = [confirmOption, cancelOption];

    Alert.alert(
      I18n.t(ext('locationPermissionsPrompt')),
      message,
      alertOptions,
    );
  }

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      renderRightComponent: () => this.renderRightNavBarComponent(),
    };
  }

  renderRow(place) {
    const { cardStatesByLocation, placeRewardsParentCategoryId } = this.props;
    const { id } = place;

    const points = _.get(cardStatesByLocation[id], 'points');

    return (
      <PlaceIconView
        place={{ ...place, placeRewardsParentCategoryId }}
        points={points}
      />
    );
  }

  renderData(data) {
    const { cardStatesByLocation } = this.props;
    const { mapView } = this.state;
    const loading = isBusy(data) || !isInitialized(data);

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    if (mapView) {
      return (
        <MapList
          cardStatesByLocation={cardStatesByLocation}
          places={data}
        />
      );
    }

    return (
      <ListView
        data={[...data]}
        loading={loading}
        renderRow={this.renderRow}
        onRefresh={this.refreshData}
        onLoadMore={this.loadMore}
        getSectionId={this.getSectionId}
        renderSectionHeader={this.renderSectionHeader}
      />
    );
  }

  render() {
    const { data } = this.props;
    const { renderCategoriesInline } = this.state;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        {renderCategoriesInline ? this.renderCategoriesDropDown('horizontal') : null}
        {this.renderData(data)}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { allCardStates, allLocations, permissionStatus } = state[ext()];
  const placeRewardsParentCategoryId = _.get(ownProps, 'shortcut.settings.cmsCategory.id');

  const cardStates = getCollection(allCardStates, state);

  return {
    ...CmsListScreen.createMapStateToProps(() => allLocations)(state, ownProps),
    cardStates,
    cardStatesByLocation: _.keyBy(cardStates, 'location'),
    permissionStatus,
    placeRewardsParentCategoryId,
  };
};

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  find,
  refreshCardState,
});

const StyledPlacesList = loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PlacesList'))(currentLocation(PlacesList)),
));

export {
  StyledPlacesList as PlacesListScreen,
};
