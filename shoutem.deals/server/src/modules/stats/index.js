import DealStatsDashboard from './fragments/deal-stats-dashboard';
import TransactionStatsDashboard from './fragments/transaction-stats-dashboard';

import { reducer } from './redux';

export { moduleName, TRANSACTION_ACTIONS } from './const';

export {
  getDealStats,
  getTransactionStats,
  loadDealStats,
  loadTransactionStats,
  createTransaction,
  createCatalog,
  loadNextPage,
  loadPreviousPage,
  invalidateStats,
} from './redux';

export { DealStatsFilter } from './components';

export { DealStatsDashboard, TransactionStatsDashboard };
export default reducer;
