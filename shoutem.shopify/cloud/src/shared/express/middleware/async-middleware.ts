import { NextFunction, Request, Response } from 'express';

/* eslint-disable @typescript-eslint/no-explicit-any */

const asyncMiddleware = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res)
    .then(() => next)
    .catch(next)
    .finally(() => {
      if (!res.headersSent) {
        next();
      }
    });
};

export { asyncMiddleware };
