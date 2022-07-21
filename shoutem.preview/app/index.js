import { restartAppMiddleware } from './redux';

export {
  appDidMount,
  appWillMount,
  appWillUnmount,
  isPreviewApp,
  renderProvider,
} from './app';

export const middleware = [restartAppMiddleware];
