import { Request } from 'express';
import { getLocals, setLocals } from '../../../src/shared/express';
import { AUTH_TOKEN } from '../const';
import { TokenData } from './token';

export function getAuthToken(req: Request): TokenData {
  return getLocals<TokenData>(req, AUTH_TOKEN);
}

export function setAuthToken(req: Request, tokenData: TokenData): void {
  setLocals(req, AUTH_TOKEN, tokenData);
}
