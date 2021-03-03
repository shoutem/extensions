import _ from 'lodash';
import { EXPORT_CAPABILITIES } from '../const';

export function canExportData(shortcut) {
  return _.includes(shortcut.capabilities, EXPORT_CAPABILITIES.CSV);
}
