import express from 'express';
import { loadAppId } from '../middleware';
import { authenticate } from '../../../core/auth';
import { tokensRouter } from '../../tokens';
import { contactsRouter } from '../../contacts';
import { healthRouter } from './health-router';

/**
 Comment out these imports if you want to use them
 Before commenting out them first check how they are implemented
 and if they are suitable for you
 */
// import { assertAuthenticated } from './shared/auth';

export const router = new express.Router();

const mockTokenProvider = {
  validateToken: async () => Promise.resolve('antinUsername'),
};

router.use(authenticate(mockTokenProvider));
router.use('/v1/:appId/contacts', contactsRouter);
router.use('/v1/:appId/redirect', tokensRouter);
router.use('/v1/health', healthRouter);

router.param('appId', loadAppId());
