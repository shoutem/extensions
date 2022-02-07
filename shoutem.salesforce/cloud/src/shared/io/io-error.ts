export class IoError extends Error {
  public code: string;

  public detail: string;

  constructor(detail, code) {
    super(detail);
    this.code = code;
    this.detail = detail;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ioErrorAdapter = {
  serialize(err: Error) {
    if (err instanceof IoError) {
      const error = {
        status: '400',
        title: 'io error',
        code: err.code,
        detail: err.detail,
        meta: {
          trace: err.stack,
        },
      };

      return error;
    }

    return null;
  },
};
