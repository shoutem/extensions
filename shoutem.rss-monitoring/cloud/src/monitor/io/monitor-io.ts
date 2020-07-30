import { jsonapi } from '../../shared/io';
import { loadModel } from '../../shared/db';
import { Monitor } from '../data/monitor-model';
import { MONITOR_TYPE } from './types';

jsonapi.registerType(MONITOR_TYPE, {
  load: loadModel(Monitor),
});
