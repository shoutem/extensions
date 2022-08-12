import React from 'react';
// import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind';
import { find, isBusy, isInitialized, isValid } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListView } from '@shoutem/ui';
import { CmsListScreen, currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton } from 'shoutem.navigation';
import { MapList, PlacePhotoView } from '../components';
import { ext } from '../const';
import { getAllPlaces } from '../redux';

export class PlacesList extends CmsListScreen {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('places'),
      mapView: false,
    };
  }

  fetchData(options) {
    // Commenting out use of LayoutAnimation because of issues with
    // @shoutem/ui's DropDownModal component.
    // TODO: Use LayoutAnimation once its conflict with Modal is resolved:
    // https://github.com/facebook/react-native/issues/32504
    // LayoutAnimation.easeInEaseOut();
    return super.fetchData(options);
  }

  toggleMapView() {
    const { mapView } = this.state;

    // Commenting out use of LayoutAnimation because of issues with
    // @shoutem/ui's DropDownModal component.
    // TODO: Use LayoutAnimation once its conflict with Modal is resolved:
    // https://github.com/facebook/react-native/issues/32504
    // LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  headerRight(props) {
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

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      headerRight: this.headerRight,
    };
  }

  renderRow(place) {
    return <PlacePhotoView place={place} />;
  }

  renderData(data) {
    const initialLoad =
      !isValid(data) ||
      (isBusy(data) && (!data || data?.length === 0 || !isInitialized(data)));

    if (initialLoad) {
      return this.renderLoading();
    }

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    const { mapView } = this.state;

    if (mapView) {
      return <MapList places={data} />;
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={isBusy(data)}
        onLoadMore={this.loadMore}
        onRefresh={this.refreshData}
        renderRow={this.renderRow}
      />
    );
  }
}

PlacesList.propTypes = {
  ...CmsListScreen.propTypes,
};

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  getAllPlaces,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  find,
});

const StyledPlacesList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PlacesList'))(currentLocation(PlacesList)));

export { StyledPlacesList as PlacesListScreen };
