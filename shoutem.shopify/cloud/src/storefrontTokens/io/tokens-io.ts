import { loadModel } from '../../shared/db';
import { jsonapi } from '../../shared/io';
import { Tokens } from '../data/tokens-model';
import { STOREFRONT_TOKENS_TYPE } from './types';

jsonapi.registerType(STOREFRONT_TOKENS_TYPE, {
  load: loadModel(Tokens),
});
