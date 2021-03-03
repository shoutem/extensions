import _ from 'lodash';
import { HttpError, DEFAULT_STATUS_CODE } from './http-error';

export class HttpErrorWithMeta extends HttpError {
  meta?: HttpErrorMeta;

  constructor(
    status = DEFAULT_STATUS_CODE,
    detail = '',
    title = 'http error',
    code,
    meta: HttpErrorMeta | null = null,
  ) {
    super(status, detail, title, code);

    if (!_.isNil(meta)) {
      this.meta = meta;
    }
  }
}

export class HttpErrorMeta {
  constructor({ propertyName }) {
    if (!_.isNil(propertyName)) {
      this.propertyName = propertyName;
    }
  }

  propertyName?: string;
}
