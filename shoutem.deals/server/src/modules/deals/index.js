import { reducer } from './redux';

import DealsDashboard from './fragments/deals-dashboard';

export { moduleName, DEFAULT_LIMIT, DEFAULT_OFFSET } from './const';

export {
  loadDeals,
  loadNextDealsPage,
  loadPreviousDealsPage,
  loadDealCategories,
  createDealCategory,
  loadPlaces,
  getDeals,
  deleteDeal,
  createDeal,
  updateDeal,
  getDealCategories,
  getPlaces,
} from './redux';
export default reducer;
export { DealsDashboard };
