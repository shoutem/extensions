import { jsonapi } from '../../shared/io';
import { loadModel } from '../../shared/db';
import { Feed } from '../data/feed-model';
import { FEED_TYPE } from './types';
import { MONITOR_TYPE } from '../../monitor/io/types';

jsonapi.registerType(FEED_TYPE, {
  load: loadModel(Feed),
  relationships: {
    monitor: {
      type: MONITOR_TYPE,
      alternativeKey: 'monitorId',
    },
  },
});
