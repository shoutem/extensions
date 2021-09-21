import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LayoutAnimation, Alert } from 'react-native';
import { connect } from 'react-redux';
import { find, isBusy, isInitialized, getCollection } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';
import { getExtensionSettings } from 'shoutem.application';
import { loginRequired } from 'shoutem.auth';
import { CmsListScreen, currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { getRouteParams, HeaderTextButton } from 'shoutem.navigation';
import MapList from '../../components/MapList';
import PlaceIconView from '../../components/PlaceIconView';
import { refreshCardState } from '../../services';
import { ext } from '../../const';
import NoProgramScreen from '../NoProgramScreen';

/**
 * A base screen for displaying a list of loyalty places.
 */
export class PlacesList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    // A dictionary of card states with location as the key
    cardStatesByLocation: PropTypes.object,
    // Refreshes card state when it changes after a transaction
    refreshCardState: PropTypes.func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('places'),
      renderCategoriesInline: true,
      mapView: false,
    };
  }

  componentDidMount() {
    const { navigation, programId, refreshCardState } = this.props;

    navigation.setOptions({
      ...this.getNavBarProps(),
    });

    if (!this.state.schema) {
      throw Error(
        'Invalid Screen state "schema". Screen that extends CMSListScreen ' +
          'must define (content) "schema" property in the state.',
      );
    }

    if (programId) {
      super.refreshInvalidContent(this.props, true);
      refreshCardState();
    }
  }

  refreshData() {
    const { programId } = this.props;

    if (programId) {
      super.refreshData();
      refreshCardState();
    }
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

  renderRightNavBarComponent(props) {
    const { mapView } = this.state;
    const actionText = mapView
      ? I18n.t('shoutem.cms.navBarListViewButton')
      : I18n.t('shoutem.cms.navBarMapViewButton');

    return (
      <HeaderTextButton
        {...props}
        onPress={this.toggleMapView}
        title={actionText}
      />
    );
  }

  promptForLocationPermission(message, confirmationMessage, onConfirmation) {
    const confirmOption = {
      text: confirmationMessage,
      onPress: onConfirmation,
    };
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
      headerRight: this.renderRightNavBarComponent,
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
        <MapList cardStatesByLocation={cardStatesByLocation} places={data} />
      );
    }

    return (
      <ListView
        data={[...data]}
        getSectionId={this.getSectionId}
        loading={loading}
        onLoadMore={this.loadMore}
        onRefresh={this.refreshData}
        renderRow={this.renderRow}
      />
    );
  }

  render() {
    const { data, navigation, programId } = this.props;
    const { renderCategoriesInline } = this.state;

    if (!programId) {
      return <NoProgramScreen navigation={navigation} />;
    }

    return (
      <Screen>
        {renderCategoriesInline
          ? this.renderCategoriesDropDown('horizontal')
          : null}
        {this.renderData(data)}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { allCardStates, allLocations, permissionStatus } = state[ext()];
  const { shortcut } = getRouteParams(ownProps);
  const placeRewardsParentCategoryId = _.get(
    shortcut,
    'settings.cmsCategory.id',
  );

  const cardStates = getCollection(allCardStates, state);

  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');

  return {
    ...CmsListScreen.createMapStateToProps(() => allLocations)(state, ownProps),
    cardStates,
    cardStatesByLocation: _.keyBy(cardStates, 'location'),
    permissionStatus,
    placeRewardsParentCategoryId,
    programId,
  };
};

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  find,
  refreshCardState,
});

const StyledPlacesList = loginRequired(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(connectStyle(ext('PlacesList'))(currentLocation(PlacesList))),
);

export { StyledPlacesList as PlacesListScreen };
