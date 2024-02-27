/*
  Functions in this module simplify interaction between middleware functions
  and request/response.locals. Sole purpose of `locals` is storing and
  sharing intermediate data between middleware.
*/
import _ from 'lodash';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Read data stored inside particular `namespace` of `obj.locals`.
 */
export function getLocals<T>(obj: object, namespace: string, defaultValue: any = undefined): T {
  return _.get(obj, `locals.${namespace}`, defaultValue);
}

/*
 * Store `data` inside `obj.locals[namespace]`.
 *
 * `obj` can be any object, but is usually either request or response.
 * `namespace` groups all data belonging to one middleware - for example,
 * authentication middleware might save user id to `req.locals.auth.userId`.
 */
export function setLocals(obj: any, namespace: string, data: any) {
  if (!obj.locals) obj.locals = {};
  if (data === undefined) return _.unset(obj, `locals.${namespace}`);
  if (obj.locals[namespace]) return _.merge(obj.locals[namespace], data);
  return _.set(obj, `locals.${namespace}`, data);
}
