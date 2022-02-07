import { asyncParamMiddleware } from '../../shared/express';
import { setAppId } from '../service';

export default function () {
  return asyncParamMiddleware(async (req, res, id) => {
    setAppId(req, { id });
  });
}
