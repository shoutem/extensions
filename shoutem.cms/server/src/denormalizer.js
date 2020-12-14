import { ReduxApiStateDenormalizer } from '@shoutem/redux-io';
import { ext } from 'context';
import {
  CATEGORIES,
  CHANNELS,
  IMAGES,
  VIDEOS,
  SCHEMAS,
  CURRENT_SCHEMA,
} from './types';

// define your storage mappings here
const denormalizerMappings = {
  [CATEGORIES]: [ext(), 'storage', CATEGORIES],
  [CHANNELS]: [ext(), 'storage', CHANNELS],
  [SCHEMAS]: [ext(), 'storage', SCHEMAS],
  [CURRENT_SCHEMA]: [ext(), 'storage', CURRENT_SCHEMA],
  // TODO: refactor this, this needs to be loaded dynamically
  [IMAGES]: [ext(), 'storage', IMAGES],
  [VIDEOS]: [ext(), 'storage', VIDEOS],
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

export function getDenormalizer() {
  return denormalizer;
}

export function denormalizeCollection(...args) {
  return denormalizer.denormalizeCollection(...args);
}

export function denormalizeItem(...args) {
  return denormalizer.denormalizeOne(...args);
}
