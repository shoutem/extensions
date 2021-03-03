import { loadModel } from '../../shared/db';
import { jsonapi } from '../../shared/io';
import { Settings } from '../data/settings-model';
import { SETTINGS_TYPE } from './types';

jsonapi.registerType(SETTINGS_TYPE, {
  load: loadModel(Settings),
});
