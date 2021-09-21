import _ from 'lodash';
import { Platform } from 'react-native';

export function dealHasLocation(deal) {
  return (
    deal &&
    _.has(deal, 'place.location.latitude') &&
    _.has(deal, 'place.location.longitude')
  );
}

export function getDealLocation(deal) {
  if (!dealHasLocation(deal)) {
    return null;
  }

  return _.get(deal, 'place.location');
}

export function getMarkersFromDeals(deals) {
  return _.map(_.filter(deals, dealHasLocation), deal => ({
    latitude: parseFloat(_.get(deal, 'place.location.latitude')),
    longitude: parseFloat(_.get(deal, 'place.location.longitude')),
    deal,
  }));
}

export function getCoordinatesDelta(deals, coordinateName) {
  return (
    _.maxBy(deals, coordinateName)[coordinateName] -
    _.minBy(deals, coordinateName)[coordinateName]
  );
}

export function getInitialRegionFromDeals(deals) {
  const defaultLatitudeDelta = 0.01;
  const defaultLongitudeDelta = 0.01;

  const validDeals = _.map(_.filter(deals, dealHasLocation), deal => ({
    latitude: parseFloat(_.get(deal, 'place.location.latitude')),
    longitude: parseFloat(_.get(deal, 'place.location.longitude')),
  }));

  if (_.isEmpty(validDeals)) {
    return null;
  }

  const latitudeDelta =
    getCoordinatesDelta(validDeals, 'latitude') || defaultLatitudeDelta;
  const longitudeDelta =
    getCoordinatesDelta(validDeals, 'longitude') || defaultLongitudeDelta;

  return {
    latitude: _.meanBy(validDeals, 'latitude'),
    longitude: _.meanBy(validDeals, 'longitude'),
    latitudeDelta: latitudeDelta * 1.5,
    longitudeDelta: longitudeDelta * 1.5,
  };
}

export function getMarkersAndRegionFromDeals(data) {
  if (_.isEmpty(data)) {
    return {
      markers: [],
      region: undefined,
    };
  }

  return {
    markers: getMarkersFromDeals(data),
    region: getInitialRegionFromDeals(data),
  };
}

export function resolveMapScheme(deal) {
  if (!dealHasLocation(deal)) {
    return null;
  }

  const {
    place: { location },
  } = deal;
  const { latitude, longitude, formattedAddress } = location;

  return Platform.OS === 'ios'
    ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${formattedAddress}`
    : `geo:${latitude},${longitude}?q=${formattedAddress}`;
}
