import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connectStyle } from '@shoutem/theme';
import { Image, ListView, Screen } from '@shoutem/ui';
import { currentLocation } from 'shoutem.cms';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import {
  GooglePlaceItem,
  GooglePlacesError,
  SearchInput,
  SearchInstructions,
} from '../components';
import { ext } from '../const';
import {
  addRecentSearch,
  clearGooglePlaces,
  fetchGooglePlaces,
  getGooglePlaces,
  getRecentSearches,
} from '../redux';

const backgroundImage = require('../assets/besttime-bg.png');

export class SearchScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.fetchPlaces = _.debounce(this.fetchPlaces, 500);

    this.state = {
      searchInput: '',
    };
  }

  componentDidMount() {
    const { currentLocation, useLocationBiasing, navigation } = this.props;

    navigation.setOptions({
      ...composeNavigationStyles(['noBorder']),
    });

    if (!currentLocation && useLocationBiasing) {
      const { checkPermissionStatus } = this.props;

      checkPermissionStatus();
    }
  }

  componentWillUnmount() {
    const { clearGooglePlaces } = this.props;

    clearGooglePlaces();
  }

  fetchPlaces(input) {
    const {
      fetchGooglePlaces,
      currentLocation,
      locationBiasingRadius,
    } = this.props;

    fetchGooglePlaces(input, currentLocation, locationBiasingRadius);
  }

  clearSearchInput() {
    const { clearGooglePlaces } = this.props;

    this.setState({ searchInput: '' });
    clearGooglePlaces();
  }

  updateSearchInput(searchInput) {
    this.setState({ searchInput });

    this.fetchPlaces(searchInput);
  }

  openPlace(autocompletedPlace) {
    const { addRecentSearch } = this.props;
    const { place_id: placeId } = autocompletedPlace;

    if (Platform.OS === 'android') {
      Keyboard.dismiss();
    }

    addRecentSearch(autocompletedPlace);
    navigateTo(ext('ForecastScreen'), { placeId });
  }

  renderRow(autocompletedPlace) {
    const { description } = autocompletedPlace;

    return (
      <GooglePlaceItem
        description={description}
        onPress={() => this.openPlace(autocompletedPlace)}
      />
    );
  }

  render() {
    const { googlePlaces, recentSearches, style } = this.props;
    const { searchInput } = this.state;

    const hasGooglePlacesError = googlePlaces.error;
    const hasGooglePlaces = !hasGooglePlacesError && !!googlePlaces.length;
    const hasRecentSearches = !!recentSearches.length;
    const hasSearchInput = !!searchInput;

    const showGooglePlaces = hasGooglePlaces && hasSearchInput;
    const showGooglePlacesError = hasGooglePlacesError && hasSearchInput;
    const showRecentSearches = hasRecentSearches && !hasSearchInput;
    const showSearchInstructions =
      !hasGooglePlacesError && !hasGooglePlaces && !hasRecentSearches;

    return (
      <Screen>
        <Image style={style.backgroundImage} source={backgroundImage} />
        <SearchInput
          onChangeText={this.updateSearchInput}
          onClearPress={this.clearSearchInput}
          input={searchInput}
        />
        {showGooglePlaces && (
          <ListView
            data={googlePlaces}
            keyboardShouldPersistTaps="always"
            renderRow={this.renderRow}
          />
        )}
        {showRecentSearches && (
          <ListView
            data={recentSearches}
            keyboardShouldPersistTaps="always"
            renderRow={this.renderRow}
          />
        )}
        {showSearchInstructions && <SearchInstructions />}
        {showGooglePlacesError && <GooglePlacesError />}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { shortcut } = getRouteParams(ownProps);
  return {
    googlePlaces: getGooglePlaces(state),
    recentSearches: getRecentSearches(state),
    locationBiasingRadius: shortcut.settings?.radius || '50000',
    useLocationBiasing: shortcut.settings?.useLocationBiasing,
  };
};

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addRecentSearch,
      clearGooglePlaces,
      fetchGooglePlaces,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('SearchScreen'))(currentLocation(SearchScreen)));
