import DealsDashboard from './fragments/deals-dashboard';
import { reducer } from './redux';

export { DEFAULT_LIMIT, DEFAULT_OFFSET, moduleName } from './const';
export {
  createDeal,
  createDealCategory,
  deleteDeal,
  getDealCategories,
  getDeals,
  loadDealCategories,
  loadDeals,
  loadNextDealsPage,
  loadPreviousDealsPage,
  updateDeal,
} from './redux';
export default reducer;
export { DealsDashboard };
