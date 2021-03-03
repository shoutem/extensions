import { Request } from 'express';
import { getLocals, setLocals } from '../../shared/express';
import { USERS_LOCALS_PATH, User } from '../const';

export function getUser(req: Request): User {
  return getLocals<User>(req, USERS_LOCALS_PATH);
}

export function setUser(req: Request, user: User): void {
  setLocals(req, USERS_LOCALS_PATH, user);
}
