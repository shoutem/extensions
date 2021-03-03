import _ from 'lodash';
import { cloneStatus } from '@shoutem/redux-io';

export function remapAndFilterPhotos(data) {
  const filteredPhotos = _.filter(data, photo =>
    _.get(_.head(photo.imageAttachments), 'src'),
  );

  const photos = _.map(filteredPhotos, (photo, id) => {
    return {
      source: {
        uri: _.get(_.head(photo.imageAttachments), 'src'),
      },
      title: _.get(photo, 'title'),
      description: _.get(photo, 'summary'),
      id: `${_.get(photo, 'id')}${id}`,
      timeUpdated: _.get(photo, 'timeUpdated'),
      uuid: _.get(photo, 'uuid'),
    };
  });

  cloneStatus(data, photos);

  return photos;
}
