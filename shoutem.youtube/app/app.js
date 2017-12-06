import rio from '@shoutem/redux-io';
import { YOUTUBE_VIDEOS_SCHEMA } from './redux';
import { API_ENDPOINT } from './const';

export function appDidMount() {
  rio.registerResource({
    schema: YOUTUBE_VIDEOS_SCHEMA,
    request: {
      endpoint: `${API_ENDPOINT}{?query*}`,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
}
