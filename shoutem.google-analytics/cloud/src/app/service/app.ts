import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { App } from '../data/app-model';
import { APP_LOCALS_PATH } from '../const';

export function getApp(req: Request): App {
  return getLocals<App>(req, APP_LOCALS_PATH);
}

export function setApp(req: Request, app: App): void {
  setLocals(req, APP_LOCALS_PATH, app);
}
