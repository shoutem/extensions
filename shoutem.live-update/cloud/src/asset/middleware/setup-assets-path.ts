import { setLocals } from '../../shared/express';
import { getApp } from '../../app/service';

export default function setupAssetsPath() {
  return (req, res, next) => {
    const app = getApp(req);
    setLocals(req, 'assetsPath', `apps/${app.appId}`);
    next();
  };
}
