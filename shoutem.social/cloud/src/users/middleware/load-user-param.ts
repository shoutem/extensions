import _ from 'lodash';
import { asyncParamMiddleware } from '../../shared/express';
import { setUser } from '../service';

export default function () {
  return asyncParamMiddleware(async (req, res, userId) => {
    const id = _.replace(userId, 'legacyId:', '');

    setUser(req, { id });
  });
}
