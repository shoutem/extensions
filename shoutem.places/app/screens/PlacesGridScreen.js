import React from 'react';
// import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import { isBusy, isInitialized, isValid } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { GridRow, ListView } from '@shoutem/ui';
import { CmsListScreen, currentLocation } from 'shoutem.cms';
import { I18n } from 'shoutem.i18n';
import { HeaderTextButton } from 'shoutem.navigation';
import {
  MapList,
  PlaceFullGridRowView,
  PlaceHalfGridRowView,
} from '../components';
import { ext } from '../const';
import { getAllPlaces } from '../redux';

let row = [];
class PlacesGridScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

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

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      headerRight: this.renderRightNavBarComponent,
    };
  }

  renderRow(place, index) {
    const { data } = this.props;

    if (index === 0 || index % 5 === 0) {
      return <PlaceFullGridRowView place={place} />;
    }

    if (row.length === 0 || row.length === 1) {
      row.push(<PlaceHalfGridRowView place={place} />);
    }

    if (row.length === 2 || index === data.length - 1) {
      const itemsRow = row;
      row = [];

      return (
        <GridRow styleName="no-padding" columns={2}>
          {itemsRow}
        </GridRow>
      );
    }

    return null;
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

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  getAllPlaces,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

const StyledPlacesGridScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PlacesGridScreen'))(currentLocation(PlacesGridScreen)));

export { StyledPlacesGridScreen as PlacesGridScreen };
