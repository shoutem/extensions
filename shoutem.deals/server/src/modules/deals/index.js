export {
  moduleName,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from './const';

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

import { reducer } from './redux';
export default reducer;

import DealsDashboard from './fragments/deals-dashboard';
export {
  DealsDashboard,
};
