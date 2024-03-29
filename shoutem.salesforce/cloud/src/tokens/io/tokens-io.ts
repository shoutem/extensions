import { loadModel } from '../../shared/db';
import { jsonapi } from '../../shared/io';
import { Tokens } from '../data/tokens-model';
import { TOKENS_TYPE } from './types';

jsonapi.registerType(TOKENS_TYPE, {
  load: loadModel(Tokens),
});
