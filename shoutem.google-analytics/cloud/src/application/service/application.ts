import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { APPLICATION_LOCALS_PATH } from '../const';

export function getApplication(req: Request): any {
  return getLocals<any>(req, APPLICATION_LOCALS_PATH);
}

export function setApplication(req: Request, application: any): void {
  setLocals(req, APPLICATION_LOCALS_PATH, application);
}
