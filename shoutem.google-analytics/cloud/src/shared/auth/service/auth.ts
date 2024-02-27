import { Request } from 'express';
import { getLocals, setLocals } from '../../express';
import { SecurityContext } from '../../acl';
import { AUTH } from '../const';

export interface AuthData {
  securityContext: SecurityContext;
  acl: any;
}

export function getAuthData(req: Request): AuthData {
  return getLocals<AuthData>(req, AUTH);
}

export function setAuthData(req: Request, authData: AuthData): void {
  setLocals(req, AUTH, authData);
}
