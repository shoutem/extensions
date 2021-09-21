import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Screen, Spinner, Subtitle, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import {
  composeNavigationStyles,
  getRouteParams,
  navigateTo,
} from 'shoutem.navigation';
import ForecastGraph from '../components/ForecastGraph';
import OpenHours from '../components/OpenHours';
import { ext } from '../const';
import {
  clearGooglePlaceDetails,
  clearLiveForecast,
  clearNewForecast,
  fetchGooglePlaceDetails,
  fetchLiveForecast,
  fetchNewForecast,
  getGooglePlaceDetails,
  getLiveBusyness,
  getLiveForecast,
  getNewForecast,
  getRawDayForecast,
  getRawLiveForecast,
} from '../redux';

export class ForecastScreen extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  componentDidMount() {
    const { place, fetchGooglePlaceDetails, navigation } = this.props;
    const { placeId } = getRouteParams(this.props);
    const title = _.get(place, 'name', '');

    navigation.setOptions({
      ...composeNavigationStyles(['noBorder']),
      title,
    });

    clearGooglePlaceDetails();
    fetchGooglePlaceDetails(placeId);
  }

  componentDidUpdate(prevProps) {
    const { place } = this.props;

    if (!prevProps.place && place) {
      LayoutAnimation.easeInEaseOut();

      const { fetchLiveForecast, fetchNewForecast } = this.props;

      fetchLiveForecast(place);
      fetchNewForecast(place);
    }
  }

  componentWillUnmount() {
    const {
      clearGooglePlaceDetails,
      clearNewForecast,
      clearLiveForecast,
    } = this.props;

    clearGooglePlaceDetails();
    clearNewForecast();
    clearLiveForecast();
  }

  openMapView() {
    const { place } = this.props;
    navigateTo(ext('MapScreen'), { place });
  }

  render() {
    const {
      place,
      liveBusyness,
      liveForecast,
      newForecast,
      rawDayForecast,
      rawLiveForecast,
      style,
    } = this.props;

    const forecastsLoading = !liveForecast || !newForecast;

    return (
      <Screen styleName="paper">
        {place && !place.error && (
          <>
            <View styleName="horizontal v-center md-gutter">
              <Icon name="pin" />
              <Subtitle styleName="sm-gutter-left md-gutter-right">
                {place.formatted_address}
              </Subtitle>
            </View>
            <OpenHours place={place} />
          </>
        )}
        {!place && (
          <View styleName="h-center md-gutter-vertical">
            <Spinner />
          </View>
        )}
        {place && place.error && (
          <View styleName="horizontal v-center h-center md-gutter-horizontal md-gutter-bottom lg-gutter-top">
            <Subtitle styleName="h-center">
              {I18n.t(ext('noPlaceDetailsFoundMessage'))}
            </Subtitle>
          </View>
        )}
        <ForecastGraph
          forecastsLoading={forecastsLoading}
          liveBusyness={liveBusyness}
          liveForecast={liveForecast}
          newForecast={newForecast}
          rawLiveForecast={rawLiveForecast}
          rawDayForecast={rawDayForecast}
        />
        {place && (
          <View styleName="horizontal h-center lg-gutter-top">
            <Button onPress={this.openMapView} styleName="secondary">
              <Icon name="maps" />
              <Subtitle
                styleName="sm-gutter-vertical sm-gutter-left md-gutter-right"
                style={style.buttonText}
              >
                {I18n.t(ext('showOnMap'))}
              </Subtitle>
            </Button>
          </View>
        )}
      </Screen>
    );
  }
}

export const mapStateToProps = state => {
  return {
    liveBusyness: getLiveBusyness(state),
    liveForecast: getLiveForecast(state),
    newForecast: getNewForecast(state),
    rawLiveForecast: getRawLiveForecast(state),
    rawDayForecast: getRawDayForecast(state),
    place: getGooglePlaceDetails(state),
  };
};

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearGooglePlaceDetails,
      clearLiveForecast,
      clearNewForecast,
      fetchGooglePlaceDetails,
      fetchLiveForecast,
      fetchNewForecast,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ForecastScreen'))(ForecastScreen));
