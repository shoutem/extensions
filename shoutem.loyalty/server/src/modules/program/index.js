import ProgramSettings from './fragments/program-settings';

import { reducer } from './redux';

export {
  moduleName,
  PROGRAMS,
  AUTHORIZATIONS,
  CARDS,
  USERS,
  PLACES,
} from './const';

export {
  enableLoyalty,
  loadLoyaltyPlaces,
  loadCards,
  loadUsers,
  createCard,
  getLoyaltyPlaces,
  getCards,
  getCardsByUserId,
  getUsers,
} from './redux';
export { ProgramSettings };
export default reducer;
