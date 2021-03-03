/**
 * Base class for all errors. Should not be instantiated, only extended.
 * Provides support to extend error with correct stack trace capture.
 * Read: https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel/32749533#32749533
 */
export class NodeError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
