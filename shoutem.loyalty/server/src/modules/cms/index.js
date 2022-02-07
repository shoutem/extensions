import { CmsSelect } from './components';
import {
  CATEGORIES,
  createCategory,
  deleteResource,
  loadResources,
  moduleName,
  navigateToCms,
  reducer,
  SCHEMAS,
} from './redux';
import { cmsApi } from './services';

export {
  CATEGORIES,
  cmsApi,
  CmsSelect,
  createCategory,
  deleteResource,
  loadResources,
  moduleName,
  navigateToCms,
  SCHEMAS,
};

export default reducer;
