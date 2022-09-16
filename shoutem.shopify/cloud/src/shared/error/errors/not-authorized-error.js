import { HttpError } from './http-error';

/*
 Thrown whenever user is not authorized.
 */
export class NotAuthorizedError extends HttpError {
  constructor(detail = '', code = 'notAuthorized_default') {
    super('401', detail, 'not authorized', code);
  }
}
