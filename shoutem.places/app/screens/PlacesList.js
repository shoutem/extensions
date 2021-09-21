import React from 'react';
import autoBindReact from 'auto-bind';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { CmsListScreen, currentLocation } from 'shoutem.cms';
import { HeaderTextButton } from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';
import { isBusy, find, isInitialized } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ListView, Screen } from '@shoutem/ui';
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
      renderCategoriesInline: true,
      mapView: false,
    };
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
    const { mapView } = this.state;
    const loading = isBusy(data) || !isInitialized(data);

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    if (mapView) {
      return <MapList places={data} />;
    }

    return (
      <ListView
        data={data}
        getSectionId={this.getSectionId}
        initialListSize={1}
        loading={loading}
        onLoadMore={this.loadMore}
        onRefresh={this.refreshData}
        renderRow={this.renderRow}
      />
    );
  }

  render() {
    const { data } = this.props;
    const { renderCategoriesInline } = this.state;

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
