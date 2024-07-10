import { HttpError } from './http-error';

/*
 Thrown when incoming request data is conflicted.
 */
export class ConflictError extends HttpError {
  constructor(detail = '', code = 'conflict_default') {
    super('409', detail, 'conflict error', code);
  }
}
