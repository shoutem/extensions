import { NodeError } from './node-error';

export const DEFAULT_STATUS_CODE = '500';

/*
Base http error that has status, detail, code and title
 */
export class HttpError extends NodeError {
  constructor(status = DEFAULT_STATUS_CODE, detail = '', title = 'http error', code) {
    super(detail);
    this.detail = detail;
    this.title = title;
    this.code = code;
    this.status = (status && status.toString()) || DEFAULT_STATUS_CODE;
  }
}
