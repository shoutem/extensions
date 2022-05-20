import _ from 'lodash';
import { createSelector } from 'reselect';
import { getConfiguration } from '../redux';

export const getFirstShortcut = createSelector(
  [state => getConfiguration(state)],
  configuration => _.get(configuration, 'navigation[0]'),
);
