import parseIntStrict from 'parse-int';
import { asyncParamMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import {=modelName.camelCase=}Repository from '../data/{=modelName.paramCase=}-repository';
import { set{=modelName.pascalCase=} } from '../service';

export default function () {
  return asyncParamMiddleware(async(req, res, id) => {
    const dbId = parseIntStrict(id);
    const {=modelName.camelCase=} = dbId && await {=modelName.camelCase=}Repository.get(dbId);
    if (!{=modelName.camelCase=}) {
      throw new errors.NotFoundError('{=modelName.pascalCase=} not found',
        generateErrorCode('{=modelName.paramCase=}', 'notFound', '{=modelName.camelCase=}NotFound'));
    }

    set{=modelName.pascalCase=}(req, {=modelName.camelCase=});
  });
}
