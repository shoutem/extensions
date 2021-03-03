import _ from 'lodash';
import request from 'request-promise';
import { Request, Response } from 'express';
import { createLikeRequest, createCommentRequest, dispatchNotification } from '../services';
import { getStatus } from '../service';
import { SOCIAL_ACTION_TYPES } from '../const';
import { asyncMiddleware } from '../../shared/express';

export class ActionsController {
  createLike() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const status = getStatus(req);
      const likeRequest = createLikeRequest(req, status);

      const response = await request(likeRequest);

      if (response.statusCode === 200) {
        const resolvedBody = JSON.parse(response.body);
        res.send(resolvedBody);
        dispatchNotification(req, SOCIAL_ACTION_TYPES.LIKE);
      }
    });
  }

  createComment() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const status = getStatus(req);
      const commentRequest = createCommentRequest(req, status);

      const response = await request(commentRequest);

      if (response.statusCode === 200) {
        const resolvedBody = JSON.parse(response.body);
        res.send(resolvedBody);
        dispatchNotification(req, SOCIAL_ACTION_TYPES.COMMENT);
      }
    });
  }
}

export default new ActionsController();
