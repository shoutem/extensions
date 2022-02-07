import { Request, Response } from 'express';
import { asyncMiddleware } from '../../shared/express';

export class HealthController {
  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      res.send({ success: true });
    });
  }
}

export default new HealthController();
