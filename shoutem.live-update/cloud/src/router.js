import express from 'express';
import { healthRouter } from './health';
import { appRouter } from './app';

export const router = new express.Router();

router.use('/v1/health', healthRouter);
router.use('/v1/apps', appRouter);
