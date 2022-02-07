import { HttpError } from './http-error';

/*
 Thrown whenever user is not authorized to access a resource.
 */
export class ForbiddenError extends HttpError {
  constructor(detail = '', code = 'forbidden_default') {
    super('403', detail, 'forbidden', code);
  }
}
