import { Request, Response, NextFunction } from 'express';

export default (fn: (req: Request, res: Response, id: string) => void) => async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string,
) => {
  try {
    await fn(req, res, id);
  } catch (err) {
    next(err);
    return;
  }
  next();
};
