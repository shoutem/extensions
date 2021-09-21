import { Image } from 'react-native';
import _ from 'lodash';
import imagesToPrefetch from './prefetchImages.json';

export function appWillMount() {
  if (_.isEmpty(imagesToPrefetch) || !imagesToPrefetch) {
    return;
  }

  _.forEach(imagesToPrefetch, image => Image.prefetch(image));
}
