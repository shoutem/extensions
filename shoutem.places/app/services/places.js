import { Platform } from 'react-native';
import _ from 'lodash';

export function getPlaceImages(place) {
  const allImages = _.pick(place, [
    'image',
    'image2',
    'image3',
    'image4',
    'image5',
  ]);
  const images = _.reject(allImages, _.isEmpty);
  return _.values(images);
}

export function getFirstImage(place) {
  const images = getPlaceImages(place);
  return _.first(images);
}

export function getMapUrl(lat, long, address) {
  return Platform.OS === 'ios'
    ? `http://maps.apple.com/?ll=${lat},${long}&q=${address}`
    : `geo:${lat},${long}?q=${address}`;
}
