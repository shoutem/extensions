import { HttpError } from './http-error';

/*
 Thrown whenever a resource cannot be found.
 */
export class NotFoundError extends HttpError {
  constructor(detail = '', code = 'notFound_default') {
    super('404', detail, 'not found', code);
  }
}
