import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export default () => (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info({ req });
  } catch (e) {
    console.error('Error while logging request', e); // eslint-disable-line no-console
  } finally {
    next();
  }
};
