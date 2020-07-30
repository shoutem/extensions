import { jsonapi } from '../../shared/io';
import { loadModel } from '../../shared/db';
import { {=modelName.pascalCase=} } from '../data/{=moduleName=}-model';
import { {=modelName.constantCase=}_TYPE } from './types';
{=#associations=}
import { {=ioType=} } from '../../{=relatedModuleName=}/io/types';
{=/associations=}

jsonapi.registerType({=modelName.constantCase=}_TYPE, {
  load: loadModel({=modelName.pascalCase=}),
  relationships: {
    {=#associations=}
    {=name=}: {
      type: {=ioType=},
      alternativeKey: '{=alternativeKey=}',
    },
    {=/associations=}
  },
});
