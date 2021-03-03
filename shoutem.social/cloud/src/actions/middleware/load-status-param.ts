import { asyncParamMiddleware } from '../../shared/express';
import { setStatus } from '../service';

export default function () {
  return asyncParamMiddleware(async (req, res, id) => {
    setStatus(req, { id });
  });
}
