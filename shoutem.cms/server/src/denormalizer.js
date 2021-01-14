import _ from 'lodash';
import { ReduxApiStateDenormalizer } from '@shoutem/redux-io';
import { ext, store } from 'context';
import { CATEGORIES, CHANNELS, SCHEMAS, CURRENT_SCHEMA } from './types';

// define your storage mappings here
const denormalizerMappings = {
  [CATEGORIES]: [ext(), 'storage', CATEGORIES],
  [CHANNELS]: [ext(), 'storage', CHANNELS],
  [SCHEMAS]: [ext(), 'storage', SCHEMAS],
  [CURRENT_SCHEMA]: [ext(), 'storage', CURRENT_SCHEMA],
};

let denormalizer = null;

export function createDenormalizer(getState) {
  if (denormalizer === null) {
    denormalizer = new ReduxApiStateDenormalizer(
      getState,
      denormalizerMappings,
    );
  }
}

export function addSchemasToDenormalizer(schemas) {
  if (_.isEmpty(schemas)) {
    return;
  }

  const mappings = {};
  const extScope = ext();

  _.forEach(schemas, schema => {
    const value = [extScope, 'storage', schema];
    _.set(mappings, [schema], value);
  });

  const newMappings = { ...denormalizerMappings, ...mappings };
  denormalizer = new ReduxApiStateDenormalizer(store.getState, newMappings);
}

export function getDenormalizer() {
  return denormalizer;
}

export function denormalizeCollection(...args) {
  return denormalizer.denormalizeCollection(...args);
}

export function denormalizeItem(...args) {
  return denormalizer.denormalizeOne(...args);
}
