import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { ACTIONS_LOCALS_PATH, App } from '../const';

export function getAppId(req: Request): App {
  return getLocals<App>(req, ACTIONS_LOCALS_PATH);
}

export function setAppId(req: Request, app: App): void {
  setLocals(req, ACTIONS_LOCALS_PATH, app);
}
