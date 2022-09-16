import express from 'express';
import { authenticate } from '../core/auth';
import { healthRouter } from './health';
import { usersRouter } from './users';

/**
 Comment out these imports if you want to use them
 Before commenting out them first check how they are implemented
 and if they are suitable for you
 */
// import { assertAuthenticated } from './shared/auth';

export const router = new express.Router();

router.use('/v1/health', healthRouter);

const mockTokenProvider = {
  validateToken: async () => Promise.resolve('antinUsername'),
};

router.use(authenticate(mockTokenProvider));
router.use('/v1/users', usersRouter);
// Public routes
// Example: router.use('/v1/users/', userRouter);
