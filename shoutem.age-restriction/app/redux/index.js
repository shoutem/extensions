import { showAgeVerificationMiddleware } from './middleware';

export * from './actions';
export { default as reducer } from './reducer';
export * from './selectors';

export const middleware = [showAgeVerificationMiddleware];
