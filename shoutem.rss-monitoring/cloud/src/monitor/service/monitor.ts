import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { Monitor } from '../data/monitor-model';
import { MONITOR_LOCALS_PATH } from '../const';

export function getMonitor(req: Request): Monitor {
  return getLocals<Monitor>(req, MONITOR_LOCALS_PATH);
}

export function setMonitor(req: Request, monitor: Monitor): void {
  setLocals(req, MONITOR_LOCALS_PATH, monitor);
}
