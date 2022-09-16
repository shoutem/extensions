import { HttpErrorMeta, HttpErrorWithMeta } from './error-meta';

/*
 Thrown when incoming request data is malformed.
 */
export class ValidationError extends HttpErrorWithMeta {
  constructor(detail = '', code = 'validation_default', meta: HttpErrorMeta | undefined = undefined) {
    super('400', detail, 'validation error', code, meta);
  }
}
