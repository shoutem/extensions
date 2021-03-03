import _ from 'lodash';
import { Request, Response } from 'express';
import { io } from '../../shared/io';
import { asyncMiddleware } from '../../shared/express';
import { errors, generateErrorCode } from '../../shared/error';
import { getUser } from '../../users';
import { getSettings } from '../service';
import settingsRepository from '../data/settings-repository';

export class SettingsController {
  create() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const user = getUser(req);

      const data = _.pick(io.get(req), [
        'commentsOnMyStatuses',
        'likesOnMyStatuses',
        'commentsOnCommentedStatuses',
        'commentsOnLikedStatuses',
      ]);

      _.set(data, 'userId', user.id);

      const settings = await settingsRepository.create(data);
      io.setCreated(res, settings);
    });
  }

  update() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const changes = _.pick(io.get(req), [
        'commentsOnMyStatuses',
        'likesOnMyStatuses',
        'commentsOnCommentedStatuses',
        'commentsOnLikedStatuses',
      ]);

      const settings = getSettings(req);
      const settingsUpdated = await settingsRepository.update(settings.id, changes);
      io.set(res, settingsUpdated);
    });
  }

  get() {
    return asyncMiddleware(async (req: Request, res: Response) => {
      const user = getUser(req);

      const settings = await settingsRepository.findOne({ userId: user.id });
      if (!settings) {
        throw new errors.NotFoundError('User settings not found',
          generateErrorCode('settings', 'notFound', 'settingsNotFound'));
      }

      io.set(res, settings);
    });
  }
}

export default new SettingsController();
