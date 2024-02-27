import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { {=modelName.pascalCase=} } from '../data/{=moduleName=}-model';
import { {=modelName.constantCase=}_LOCALS_PATH } from '../const';

export function get{=modelName.pascalCase=}(req: Request): {=modelName.pascalCase=} {
  return getLocals<{=modelName.pascalCase=}>(req, {=modelName.constantCase=}_LOCALS_PATH);
}

export function set{=modelName.pascalCase=}(req: Request, {=modelName.camelCase=}: {=modelName.pascalCase=}): void {
  setLocals(req, {=modelName.constantCase=}_LOCALS_PATH, {=modelName.camelCase=});
}
