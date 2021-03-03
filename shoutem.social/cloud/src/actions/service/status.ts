import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { ACTIONS_LOCALS_PATH, Status } from '../const';

export function getStatus(req: Request): Status {
  return getLocals<Status>(req, ACTIONS_LOCALS_PATH);
}

export function setStatus(req: Request, status: Status): void {
  setLocals(req, ACTIONS_LOCALS_PATH, status);
}
